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
from Core import views as CoreViews
from User import views as UserViews
from PerformanceEvaluator import views as PerformanceEvaluatorViews
from rest_framework import routers
from django.views.generic import TemplateView

router = routers.DefaultRouter()
router.register(r'sites', CoreViews.SiteViewSet)
router.register(r'pages', CoreViews.PageViewSet)
router.register(r'answers', CoreViews.AnswerViewSet)
router.register(r'predicts', CoreViews.PredictViewSet)
router.register(r'performances', PerformanceEvaluatorViews.PerformanceViewSet)
router.register(r'users', UserViews.UserViewSet)
router.register(r'groups', UserViews.GroupViewSet)

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='home.html')),
    url(r'^router', include(router.urls)),
    url(r'^api_auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', admin.site.urls),

    url(r'^calculations/', PerformanceEvaluatorViews.calculations),
    url(r'^benchmark/', CoreViews.mainPage, name='benchmark'),
    url(r'^performance/', CoreViews.performancePage),
    url(r'^performance_detail/', CoreViews.performanceDetailPage),
    url(r'^accounts/', include('django.contrib.auth.urls')),
]
