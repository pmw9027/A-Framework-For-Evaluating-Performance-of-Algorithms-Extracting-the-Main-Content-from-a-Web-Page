from Core.models import Site, Page, Answer, AnswerIndex, AnswerSet, TestSetSite, TestSetPage
from django.http import JsonResponse, FileResponse, HttpResponseNotFound, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
import os
from .forms import PageForm, UploadFileForm
from django.core.exceptions import ObjectDoesNotExist
from django.forms import model_to_dict
from rest_framework.permissions import IsAuthenticated
from pathlib import Path


class TestSetPageAPIView(APIView):
    permission_classes = []

    def get(self, request, test_set_page_id=None):

        if test_set_page_id:
            try:
                page = TestSetPage.objects.get(id=test_set_page_id).page
            except TestSetPage.DoesNotExist:
                return HttpResponseNotFound("No file")


            if not page.mht_file_path:
                return HttpResponseNotFound("No file")

            path = Path(page.mht_file_path)
            if path.is_file():
                file_reponse = FileResponse(open(path, 'rb'), content_type="message/rfc822")
                file_reponse['Content-Disposition'] = f'inline; filename="{page.id}.mhtml"'
                return file_reponse

        else:
            test_set_sites = TestSetSite.objects.all()
            if request.GET.get('test_set_id'):
                test_set_sites.filter(test_set__id=request.GET.get('test_set_id'))

            values = test_set_sites.values_list('id')
            test_set_pages = TestSetPage.objects.filter(test_set_site__id__in=values).select_related('page')


            if request.GET.get('index'):

                page = test_set_pages[int(request.GET.get('index'))].page
                if not page.mht_file_path:
                    return HttpResponseNotFound("No file")

                path = Path(page.mht_file_path)
                if path.is_file():
                    file_reponse = FileResponse(open(path, 'rb'), content_type="multipart/mixed")
                    file_reponse['Content-Disposition'] = f'inline; filename="{page.id}.mhtml"'
                    return file_reponse

            return JsonResponse({
                'code': 0,
                'data': [{**model_to_dict(a), **model_to_dict(a.page)} for a in test_set_pages]

            }, safe=False)

    def post(self, request, test_set_id):

        # print(test_set_id)
        # print(request.data)
        # print(request.POST)

        return JsonResponse({}, safe=False)


class TestSetSiteAPIView(APIView):
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

        test_set_site = TestSetSite.objects.get(id=request.POST.get('id'))

        page = Page.objects.create(site=test_set_site.site, url=request.POST.get('url'), title=request.POST.get('title'))
        test_set_page = TestSetPage.objects.create(page=page, test_set_site=test_set_site)



        path = f"resources/{page.id}"
        if not os.path.exists(path):
            os.makedirs(path)

        with open(f"{path}/page.mhtml", 'wb+') as destination:
            destination.write(request.POST.get('mhtmlData').encode('ascii'))

        page.mht_file_path = f"{path}/page.mhtml"
        page.save()

        _output = {

        }

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

