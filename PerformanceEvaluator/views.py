from PerformanceEvaluator.models import Performance
from PerformanceEvaluator.serializers import PerformanceSerializer
from rest_framework import viewsets
from django.http import JsonResponse
from Core.models import Answer, Predict
from difflib import SequenceMatcher
import extract_html_diff
from io import StringIO
import lxml.html


class PerformanceViewSet(viewsets.ModelViewSet):
    queryset = Performance.objects.all()
    serializer_class = PerformanceSerializer


def calculations(request):
    # predict 번호, answer 번호, metric 종류를 get url 로 넘겨주면
    # DB 에서 해당 리소스 검색하여 performance 계산하고 결과 값 return 해줌
    # 리턴받은 결과값을 저장하는건 사용자의 몫 (RESTful CRUD 사용)

    parameters = request.GET

    answer_number = parameters.get('answer')
    predict_number = parameters.get('predict')
    metric_name = parameters.get('metric')

    condition = \
        len(parameters.keys()) == 3 and \
        answer_number is not None and \
        predict_number is not None and \
        metric_name is not None

    precision = None
    recall = None
    f1 = None

    if condition:
        if metric_name == 'area':
            answer = Answer.objects.get(answer_number=answer_number)
            predict = Predict.objects.get(predict_number=predict_number)
            precision, recall, f1 = getAreaPerformance(answer, predict)

        elif metric_name == 'tree':
            answer = Answer.objects.get(answer_number=answer_number)
            predict = Predict.objects.get(predict_number=predict_number)
            precision, recall, f1 = getTreePerformance(answer, predict)

        elif metric_name == 'tagSequence':
            answer = Answer.objects.get(answer_number=answer_number)
            predict = Predict.objects.get(predict_number=predict_number)
            precision, recall, f1 = getTagSequencePerformance(answer, predict)

        else:
            print('parameter error')
    else:
        print('parameter error')

    return JsonResponse({
        'precision': precision,
        'recall': recall,
        'f1': f1
    })


def getAreaPerformance(answer, predict):
    answer_width =  float(answer.answer_area_right) - float(answer.answer_area_left)
    answer_height = float(answer.answer_area_bottom) - float(answer.answer_area_top)

    predict_width =  float(predict.predict_area_right) - float(predict.predict_area_left)
    predict_height = float(predict.predict_area_bottom) - float(predict.predict_area_top)

    answer_area = answer_width * answer_height
    predict_area = predict_width * predict_height

    x_overlap = \
        max(0.0, min(float(predict.predict_area_right), float(answer.answer_area_right)) -
                max(float(predict.predict_area_left), float(answer.answer_area_left)))
    y_overlap = \
        max(0.0, min(float(predict.predict_area_bottom), float(answer.answer_area_bottom)) -
                max(float(predict.predict_area_top), float(answer.answer_area_top)))

    intersection_area = x_overlap * y_overlap

    area_precision = intersection_area / predict_area
    area_recall = intersection_area / answer_area
    area_f1 = (2 * area_precision * area_recall) / (area_precision + area_recall)

    return round(area_precision, 3), round(area_recall, 3), round(area_f1, 3)


def getTreePerformance(answer, predict):
    answer = answer.answer_dom
    predict = predict.predict_dom

    ted = extract_html_diff.as_string(answer, predict)

    tree_precision = (len(predict) - len(ted)) / len(predict)
    tree_recall = (len(answer) - len(ted)) / len(answer)
    tree_f1 = (2 * tree_precision * tree_recall) / \
              (tree_precision + tree_recall)

    return round(tree_precision, 3), round(tree_recall, 3), round(tree_f1, 3)


def getTagSequencePerformance(answer, predict):
    answer = answer.answer_dom
    predict = predict.predict_dom

    try:
        answer = lxml.html.parse(StringIO(answer))
        predict = lxml.html.parse(StringIO(predict))
    except Exception as e:
        print(e)
        return 0

    def getTags(doc):
        tags = list()

        for el in doc.getroot().iter():
            if isinstance(el, lxml.html.HtmlElement):
                tags.append(el.tag)
            elif isinstance(el, lxml.html.HtmlComment):
                tags.append('comment')
            else:
                raise ValueError('Don\'t know what to do with element: {}'.format(el))

        return tags

    def getLongestCommonSubstring(str1, str2):

        # initialize SequenceMatcher object with
        # input string
        seqMatch = SequenceMatcher(None, str1, str2)

        # find match of longest sub-string
        # output will be like Match(a=0, b=0, size=5)
        match = seqMatch.find_longest_match(0, len(str1), 0, len(str2))

        # print longest substring
        if (match.size != 0):
            return str1[match.a: match.a + match.size]
        else:
            return ''

    answer = getTags(answer)
    predict = getTags(predict)

    lcs = getLongestCommonSubstring(answer, predict)

    tagSeaquence_precision = len(lcs)/len(predict)
    tagSeaquence_recall = len(lcs)/len(answer)
    tagSeaquence_f1 = (2 * tagSeaquence_precision * tagSeaquence_recall) / \
                      (tagSeaquence_precision + tagSeaquence_recall)

    return round(tagSeaquence_precision, 3), round(tagSeaquence_recall, 3), round(tagSeaquence_f1, 3)

