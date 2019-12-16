"""Server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView
from rest_framework_jwt.views import obtain_jwt_token, verify_jwt_token, refresh_jwt_token


urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='home.html')),
    url('accounts/', include('django.contrib.auth.urls')),
    url('admin/', admin.site.urls),
    url('api-token-auth/', obtain_jwt_token),
    url(r'^api-token-verify/', verify_jwt_token),
    url(r'^api-token-refresh/', refresh_jwt_token),


    url(r'^answer_set_manager/', include('AnswerSetManager.urls', namespace='answer_set_manager')),
    url(r'^extractors/', include('Extractor.urls'))
]
