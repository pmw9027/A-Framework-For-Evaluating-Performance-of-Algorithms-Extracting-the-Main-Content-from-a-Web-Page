from Core.models import Site, Page, Answer, AnswerIndex, AnswerSet, TestSetSite
from django.http import JsonResponse, FileResponse, HttpResponseNotFound, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
import os
from .forms import PageForm
from django.core.exceptions import ObjectDoesNotExist
from django.forms import model_to_dict
from rest_framework.permissions import IsAuthenticated


class AnswerSetAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, test_set_id=None):

        if test_set_id:
            test_set_sites = TestSetSite.objects.filter(test_set_id=test_set_id).select_related('site')


            return JsonResponse({
                'code': 0,
                'data': [{**model_to_dict(a, exclude=['test_set', 'site']), **model_to_dict(a.site)} for a in test_set_sites]

            }, safe=False)

        else:
            answer_sets = AnswerSet.objects.filter(creator=request.user)



            return JsonResponse({
                'code': 0,
                'data': [model_to_dict(a) for a in answer_sets]

            }, safe=False)


class PageList(APIView):
    # permission_classes = [permissions.IsAuthenticated, TokenHasReadWriteScope]
    permission_classes = []

    def get(self, request, page_id=None):
        _output = {}
        user = request.user

        if page_id is None:

            answers = Answer.objects.filter(checker=user).values_list('page_id')
            web_pages = Page.objects.filter(mht_file_path__isnull=False).exclude(id__in=[answer[0] for answer in answers],)

            print(web_pages.query)

            web_pages = web_pages.values('id', 'url')

            _output['data'] = [entry for entry in web_pages]

            # _output = serializers.serialize("json", web_page)
            response = JsonResponse(_output, safe=False)

            return response

        else:
            page = Page.objects.get(id=page_id)
            from pathlib import Path

            if page.mht_file_path:
                path = Path(page.mht_file_path)
                if path.is_file():
                    file_reponse = FileResponse(open(path, 'rb'), content_type="message/rfc822")
                    file_reponse['Content-Disposition'] = f'inline; filename="{page_id}.mhtml"'
                    # fileResponse = FileResponse(open(path, 'rb'), content_type="message/rfc822")
                    return file_reponse
                else:
                    return HttpResponseNotFound("No file")

            else:
                return HttpResponseNotFound("No file")

    def post(self, request, page_id=None):
        _output = {}


        form = PageForm(request.POST)
        if not form.is_valid():
            print(form.errors)
            return HttpResponseNotFound("The form ")

        obj, created = Site.objects.get_or_create(protocol=form.cleaned_data['protocol'], domain=form.cleaned_data['domain'])
        if created:
            pass
            obj.save()
        else:
            pass

        obj, created = Page.objects.get_or_create(site=obj, url=form.cleaned_data['url'])

        if created:
            obj.save()
        else:
            pass

        # form = UploadFileForm(request.FILES)
        # if form.is_valid():
        if True:

            path = f"resources/{obj.id}"

            if not os.path.exists(path):
                os.makedirs(path)

            f = request.POST

            with open(f"{path}/page.mhtml", 'wb+') as destination:
                # for chunk in f.chunks():
                destination.write(form.cleaned_data['mhtmlData'].encode('ascii'))

            return Response(_output)
        else:
            print(form.errors)
            return Response(_output)


class AnswerPage(APIView):
    # permission_classes = [permissions.IsAuthenticated, TokenHasReadWriteScope]
    permission_classes = []

    def get(self, request, page_id=None):
        _output = {}
        user = request.user

        if page_id is None:

            objts = Answer.objects.all()

            if request.GET.get('mine'):
                objts = Answer.objects.filter(answer_checker=user)

            web_page = objts.values('answer_number')
            _output['data'] = [entry for entry in web_page]
            response = JsonResponse(_output, safe=False)
        else:

            try:
                answer = Answer.objects.get(page_id=page_id, answer_checker=user)
                answer_indexes = AnswerIndex.objects.filter(answer=answer)

                _output['data'] = [answer_index.answer_index for answer_index in answer_indexes]

                response = JsonResponse(_output, safe=False)

            except ObjectDoesNotExist:
                response = JsonResponse(_output, safe=False)

        return response

    def post(self, request, page_id=None):
        _output = {}

        # if form.is_valid():
        if page_id is None:

            return HttpResponseNotFound("The form ")
        else:
            user = request.user
            obj, created = Answer.objects.get_or_create(page_id=page_id, checker=user)

            if request.POST.getlist('indices[]'):
                answers = request.POST.getlist('indices[]')
            else:
                answers = []
            if created:

                obj.save()
            else:

                obj.save()
                answer_indexes = AnswerIndex.objects.filter(answer=obj)
                answer_indexes.delete()

            for _index in answers:
                answer = AnswerIndex(answer=obj, answer_index=_index)
                answer.save()

            return Response(_output)

