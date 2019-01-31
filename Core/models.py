from django.db import models
from django.core.validators import URLValidator


class Site(models.Model):
    site_number = models.AutoField(primary_key=True)
    site_name = models.TextField(default=None, null=True)
    site_description = models.TextField(default=None, null=True)


class Page(models.Model):
    page_number = models.AutoField(primary_key=True)
    page_url = models.TextField(validators=[URLValidator()])
    site_name = models.TextField()
    site_description = models.TextField()
    menu_xpath = models.TextField(default=None, null=True)
    menu_amount = models.IntegerField(default=None, null=True)
    mht_file = models.TextField(default=None, null=True)


class Answer(models.Model):
    answer_number = models.AutoField(primary_key=True)
    page_number = models.ForeignKey(Page, on_delete=models.CASCADE)
    answer_scorer = models.TextField(default=None, null=True)
    answer_dom = models.TextField(default=None, null=True)
    answer_area_left = models.TextField(default=None, null=True)
    answer_area_right = models.TextField(default=None, null=True)
    answer_area_top = models.TextField(default=None, null=True)
    answer_area_bottom = models.TextField(default=None, null=True)


class Predict(models.Model):
    predict_number = models.AutoField(primary_key=True)
    page_number = models.ForeignKey(Page, on_delete=models.CASCADE)
    predict_method = models.TextField(default=None, null=True)
    predict_dom = models.TextField(default=None, null=True)
    predict_area_left = models.TextField(default=None, null=True)
    predict_area_right = models.TextField(default=None, null=True)
    predict_area_top = models.TextField(default=None, null=True)
    predict_area_bottom = models.TextField(default=None, null=True)

