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

from django.urls import path

from .views import PageView

from AnswerSetManager import views

app_name = 'answer_set_manager'
urlpatterns = [
    path('pages/<str:page_id>', views.PageView.as_view(), name="test"),
    path('pages', views.PageList.as_view(), name="test"),

    path('answers/', views.AnswerPage.as_view(), name="test"),

]
