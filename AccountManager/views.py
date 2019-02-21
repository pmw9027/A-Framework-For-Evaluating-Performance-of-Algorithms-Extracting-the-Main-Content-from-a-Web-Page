from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
import json

# Create your views here.
from oauth2_provider.views.generic import ProtectedResourceView


class ApiEndpoint(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        return HttpResponse('Hello, OAuth2!')



@csrf_exempt
def is_login(request):
    print(request.COOKIES)

    response_data = {}

    if request.user.is_authenticated:
        response_data['code'] = 1
        response_data['message'] = "You are logged in"
    else:
        response_data['code'] = 0
        response_data['message'] = 'You are not logged in'

    return HttpResponse(json.dumps(response_data), content_type="application/json")


@csrf_exempt
def login_view(request):

    print(request.body)

    data = request.body.decode('utf-8')
    json_data = json.loads(data)
    username = json_data['username']
    password = json_data['password']
    user = authenticate(request, username=username, password=password)
    print(user.is_authenticated)
    print(request.user.is_authenticated)
    response_data = {}
    if user is not None:
        login(request, user)
        response_data['code'] = 1
        response_data['message'] = 'You"re logged in'
    else:
        response_data['code'] = 0
        response_data['message'] = 'You messed up'

    return HttpResponse(json.dumps(response_data), content_type="application/json")


@csrf_exempt
def logout_view(request):
    logout(request)

    response_data = {}
    response_data['code'] = 1
    response_data['message'] = "You're logged out"
    return HttpResponse(json.dumps(response_data), content_type="application/json")
