from django.contrib import admin
from .models import PerformanceMetric, PerformanceEvaluationResult
from django.db.models import ManyToManyField, Field


@admin.register(PerformanceEvaluationResult)
class PerformanceEvaluationResultAdmin(admin.ModelAdmin):

    list_display = [field.name for field in PerformanceEvaluationResult._meta.get_fields() if isinstance(field, Field) and not isinstance(field, ManyToManyField)]
    # readonly_fields = [field.name for field in PerformanceEvaluationResult._meta.get_fields() if isinstance(field, Field)]


@admin.register(PerformanceMetric)
class PerformanceMetricAdmin(admin.ModelAdmin):
    list_display = [field.name for field in PerformanceMetric._meta.get_fields() if isinstance(field, Field)]
    # readonly_fields = [field.name for field in PerformanceMetric._meta.get_fields() if isinstance(field, Field)]

