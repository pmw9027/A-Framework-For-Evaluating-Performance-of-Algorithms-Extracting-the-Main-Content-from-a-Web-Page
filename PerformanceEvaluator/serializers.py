from PerformanceEvaluator.models import Performance
from rest_framework import serializers


class PerformanceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Performance
        fields = (
            'performance_number',
            'page_number',
            'answer_number',
            'predict_number',
            'performance_metric',
            'performance_precision',
            'performance_recall',
            'performance_f1'
        )
