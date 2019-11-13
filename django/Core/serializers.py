from Core.models import Page, Answer, Predict, Site
from rest_framework import serializers


class SiteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Site
        fields = (
            'site_number',
            'site_name',
            'site_description',
        )


class PageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Page
        fields = (
            'page_number',
            'page_url',
            'site_name',
            'site_description',
            'menu_xpath',
            'menu_amount',
            'mht_file'
        )


class AnswerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Answer
        fields = (
            'answer_number',
            'page_number',
            'answer_scorer',
            'answer_dom',
            'answer_area_left',
            'answer_area_right',
            'answer_area_top',
            'answer_area_bottom'
        )


class PredictSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Predict
        fields = (
            'predict_number',
            'page_number',
            'predict_method',
            'predict_dom',
            'predict_area_left',
            'predict_area_right',
            'predict_area_top',
            'predict_area_bottom'
        )

