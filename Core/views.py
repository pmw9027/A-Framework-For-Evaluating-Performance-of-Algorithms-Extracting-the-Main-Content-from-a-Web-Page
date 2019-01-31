from Core.models import Page, Answer, Predict, Site
from Core.serializers import PageSerializer, AnswerSerializer, PredictSerializer, SiteSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from PerformanceEvaluator.models import Performance
from django.shortcuts import render


class SiteViewSet(viewsets.ModelViewSet):
    queryset = Site.objects.all()
    serializer_class = SiteSerializer


class PageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = PageSerializer


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer


class PredictViewSet(viewsets.ModelViewSet):
    queryset = Predict.objects.all()
    serializer_class = PredictSerializer


def mainPage(request):
    # localhost:8000 main 화면 접속할때 호출

    pages = Page.objects.all()
    return render(request, "benchmark.html", {
        "pages": pages
    })


def performancePage(request):
    # localhost:8000 main 화면 접속할때 호출

    pages = Page.objects.all()
    performances_area = Performance.objects.filter(performance_metric='Area')
    performances_tree = Performance.objects.filter(performance_metric='Tree')
    performances_tagSequence = Performance.objects.filter(performance_metric='Tag Sequence')

    sites = [{'site_name': pages[i].site_name, 'site_description': pages[i].site_description} for i in range(0, len(pages), 10)]

    # 10개 페이지 합산 값 저장할 임시 공간
    temp_area = {'precision': 0, 'recall': 0, 'f1': 0}
    temp_tree = {'precision': 0, 'recall': 0, 'f1': 0}
    temp_tagSequence = {'precision': 0, 'recall': 0, 'f1': 0}

    # 평균 값 담아놓을 리스트
    avgBySite_area = [{'precision': 0.0, 'recall': 0.0, 'f1': 0.0} for i in range(50)]
    avgBySite_tree = [{'precision': 0.0, 'recall': 0.0, 'f1': 0.0} for i in range(50)]
    avgBySite_tagSequence = [{'precision': 0.0, 'recall': 0.0, 'f1': 0.0} for i in range(50)]

    for i in range(170):
        temp_area['precision'] += performances_area[i].performance_precision
        temp_area['recall'] += performances_area[i].performance_recall
        temp_area['f1'] += performances_area[i].performance_f1

        temp_tree['precision'] += performances_tree[i].performance_precision
        temp_tree['recall'] += performances_tree[i].performance_recall
        temp_tree['f1'] += performances_tree[i].performance_f1

        temp_tagSequence['precision'] += performances_tagSequence[i].performance_precision
        temp_tagSequence['recall'] += performances_tagSequence[i].performance_recall
        temp_tagSequence['f1'] += performances_tagSequence[i].performance_f1

        if (i+1) % 10 == 0:
            avgBySite_area[int(i / 10)]['precision'] = '%.3f' %(temp_area['precision'] / 10.0)
            avgBySite_area[int(i / 10)]['recall'] = '%.3f' %(temp_area['recall'] / 10.0)
            avgBySite_area[int(i / 10)]['f1'] = '%.3f' %(temp_area['f1'] / 10.0)

            avgBySite_tree[int(i / 10)]['precision'] = '%.3f' %(temp_tree['precision'] / 10.0)
            avgBySite_tree[int(i / 10)]['recall'] = '%.3f' %(temp_tree['recall'] / 10.0)
            avgBySite_tree[int(i / 10)]['f1'] = '%.3f' %(temp_tree['f1'] / 10.0)

            avgBySite_tagSequence[int(i / 10)]['precision'] = '%.3f' %(temp_tagSequence['precision'] / 10.0)
            avgBySite_tagSequence[int(i / 10)]['recall'] = '%.3f' %(temp_tagSequence['recall'] / 10.0)
            avgBySite_tagSequence[int(i / 10)]['f1'] = '%.3f' %(temp_tagSequence['f1'] / 10.0)

            temp_area['precision'] = temp_area['recall'] = temp_area['f1'] = 0
            temp_tree['precision'] = temp_tree['recall'] = temp_tree['f1'] = 0
            temp_tagSequence['precision'] = temp_tagSequence['recall'] = temp_tagSequence['f1'] = 0

    return render(request, "performance.html", {
        "data": zip(
                    sites,
                    avgBySite_area,
                    avgBySite_tree,
                    avgBySite_tagSequence)
    })


def performanceDetailPage(request):
    # localhost:8000 main 화면 접속할때 호출

    pages = Page.objects.all()
    answers = Answer.objects.all()
    predicts = Predict.objects.all()
    performances_area = Performance.objects.filter(performance_metric='Area')
    performances_tree = Performance.objects.filter(performance_metric='Tree')
    performances_tagSequence = Performance.objects.filter(performance_metric='Tag Sequence')

    # data = runPerformanceEvaluator()

    return render(request, "performance_detail.html", {
        "data": zip(
                    pages,
                    answers,
                    predicts,
                    performances_area,
                    performances_tree,
                    performances_tagSequence)
    })