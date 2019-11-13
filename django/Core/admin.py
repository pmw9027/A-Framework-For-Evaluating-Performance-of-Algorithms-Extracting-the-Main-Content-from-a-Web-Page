from django.contrib import admin
from .models import *
from django.db.models.fields import Field


@admin.register(TestSetSite)
class TestSetSiteAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TestSetSite._meta.get_fields() if isinstance(field, Field)]

@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Site._meta.get_fields() if isinstance(field, Field)]


class AnswerAdmin(admin.ModelAdmin):
    # readonly_fields = ['*']
    list_display = [field.name for field in Answer._meta.get_fields() if isinstance(field, Field)]
    list_display.remove('page')
    list_display.insert(1, 'get_name')

    def get_name(self, obj):
        return obj.page.title

    # get_name.admin_order_field = 'author'  # Allows column order sorting
    get_name.short_description = 'page'


class AnswerSetAdmin(admin.ModelAdmin):
    # list_display = [field.name for field in AnswerSet._meta.get_fields()]
    list_display = [field.name for field in AnswerSet._meta.get_fields() if isinstance(field, Field)]


class PageAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Page._meta.get_fields() if isinstance(field, Field)]


class ContentExtractorAdmin(admin.ModelAdmin):

    list_display = [field.name for field in ContentExtractor._meta.get_fields() if isinstance(field, Field)]
    list_display.remove('description')


class PredictAdmin(admin.ModelAdmin):

    list_display = [field.name for field in Predict._meta.get_fields() if isinstance(field, Field)]
    # list_display.remove('description')


class PredictIndexAdmin(admin.ModelAdmin):

    list_display = [field.name for field in PredictIndex._meta.get_fields() if isinstance(field, Field)]


class PerformanceEvaluationResultAdmin(admin.ModelAdmin):

    list_display = [field.name for field in PerformanceEvaluationResult._meta.get_fields() if isinstance(field, Field)]
    readonly_fields = [field.name for field in PerformanceEvaluationResult._meta.get_fields() if isinstance(field, Field)]


class PerformanceMetricAdmin(admin.ModelAdmin):
    list_display = [field.name for field in PerformanceMetric._meta.get_fields() if isinstance(field, Field)]
    # readonly_fields = [field.name for field in PerformanceMetric._meta.get_fields() if isinstance(field, Field)]


admin.site.register(Predict, PredictAdmin)
admin.site.register(PerformanceEvaluationResult, PerformanceEvaluationResultAdmin)
admin.site.register(PerformanceMetric, PerformanceMetricAdmin)
admin.site.register(PredictIndex, PredictIndexAdmin)
admin.site.register(Page, PageAdmin)
admin.site.register(Answer, AnswerAdmin)
admin.site.register(AnswerSet, AnswerSetAdmin)
admin.site.register(ContentExtractor, ContentExtractorAdmin)
