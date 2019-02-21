from Core.models import Page, Answer
from django.http import JsonResponse, FileResponse
from oauth2_provider.views.generic import ProtectedResourceView, ReadWriteScopedResourceView, ScopedProtectedResourceView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope, TokenHasResourceScope
from django.shortcuts import render

#
# # Create your views here.
# class PageView(ReadWriteScopedResourceView):
#     required_scopes = []
#
#     def get(self, request, page_id=None):
#
#         _output = {}
#
#         if request.method == 'GET':
#
#             if page_id is None:
#
#                 # web_page = Page.objects.all()
#                 web_page = Page.objects.filter(test=True)
#
#                 web_page = web_page.values('pk', 'page_url')
#                 _output['data'] = [entry for entry in web_page]
#
#                 # _output = serializers.serialize("json", web_page)
#
#                 response = JsonResponse(_output, safe=False)
#                 return response
#
#             else:
#
#                 return FileResponse(open('AnswerSetManager/resources/nate.mhtml', 'rb'), content_type='message/rfc822')
#             # return render(request, 'nate.mhtml', {'poll': 0}, content_type='multipart/related')
#             #
#             # return response
#
#         elif request.method == 'POST':
#
#             response = JsonResponse(_output, safe=False)
#             return response
#         else :
#             response = JsonResponse(_output, safe=False)
#             return response


class PageView(APIView):
    permission_classes = []

    def get(self, request, page_id=None):
        _output = {}
        response = {}

        print(page_id)
        if page_id is None:

            web_page = Page.objects.filter(test=True)

            web_page = web_page.values('pk', 'page_url')
            _output['data'] = [entry for entry in web_page]

            # _output = serializers.serialize("json", web_page)
            response = JsonResponse(_output, safe=False)
        else:
            pass

        return render(request, "performance.html", {})


class PageList(APIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasReadWriteScope]

    def get(self, request, page_id=None):
        _output = {}
        response = {}

        print(page_id)
        if page_id is None:

            web_page = Page.objects.filter(test=True)

            web_page = web_page.values('pk', 'page_url')
            _output['data'] = [entry for entry in web_page]

            # _output = serializers.serialize("json", web_page)
            response = JsonResponse(_output, safe=False)
        else:
            pass

        return response

    def post(self, request, format=None):
        _output = {}

        return Response(_output)


class AnswerPage(APIView):
    permission_classes = [permissions.IsAuthenticated, TokenHasReadWriteScope]

    def get(self, request, page_id=None):
        _output = {}
        response = {}
        if page_id is None:

            web_page = Page.objects.filter(test=True)

            web_page = web_page.values('pk', 'page_url')
            _output['data'] = [entry for entry in web_page]

            # _output = serializers.serialize("json", web_page)
            response = JsonResponse(_output, safe=False)
        else:
            pass

        return response

    def post(self, request, _format=None):
        _output = {}

        print(request.POST)

        obj, created = Answer.objects.get_or_create()

        if created:
            pass
        else:
            pass

        return Response(_output)
