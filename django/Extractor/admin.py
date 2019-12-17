from django.contrib import admin
from django.db.models import ManyToManyField, Field
from .models import *
# Register your models here.


@admin.register(ContentExtractor)
class ContentExtractorAdmin(admin.ModelAdmin):

    list_display = [field.name for field in ContentExtractor._meta.get_fields() if isinstance(field, Field) and not isinstance(field, ManyToManyField)]
    list_display.remove('description')


@admin.register(Predict)
class PredictAdmin(admin.ModelAdmin):

    list_display = [field.name for field in Predict._meta.get_fields() if  isinstance(field, Field) and not isinstance(field, ManyToManyField)]
    # list_display.remove('description')
    list_filter = ('content_extractor', 'page')

