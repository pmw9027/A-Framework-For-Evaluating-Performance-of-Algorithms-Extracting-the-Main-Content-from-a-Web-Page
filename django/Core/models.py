from django.db import models
from django.conf import settings
from django.contrib.auth.models import User


class Site(models.Model):
    id = models.AutoField(primary_key=True)
    protocol = models.CharField(max_length=255, null=False, default='https')
    domain = models.CharField(max_length=255, null=False)
    name = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name if self.name else self.domain

    class Meta:
        unique_together = [['protocol', 'domain']]


class Page(models.Model):
    id = models.AutoField(primary_key=True)
    site = models.ForeignKey(Site, on_delete=models.SET_NULL, null=True)

    protocol = models.CharField(max_length=255, null=False, default='https')
    host = models.CharField(max_length=255, null=False)
    pathname = models.CharField(max_length=255, null=True, blank=True)
    title = models.TextField(null=True)
    description = models.TextField(null=True)

    depth = models.PositiveIntegerField()
    link = models.ForeignKey("self", on_delete=models.CASCADE, null=True)
    created = models.DateTimeField(auto_now_add=True, null=True)
    modified = models.DateTimeField(auto_now=True, null=True)
    mht_file_path = models.FilePathField(null=True, path=settings.FILE_PATH_FIELD_DIRECTORY)

    class Meta:
        unique_together = [['protocol', 'host', 'pathname']]


class NodeName(models.Model):
    id = models.AutoField(primary_key=True)
    # name = models


class Node(models.Model):

    id = models.AutoField(primary_key=True)
    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    hyu = models.PositiveIntegerField(null=False)

    node_name = models.CharField(max_length=50)

    offset_top = models.FloatField()
    offset_left = models.FloatField()

    offset_width = models.FloatField()
    offset_height = models.FloatField()

    @property
    def pos_center_x(self):
        return self.offset_left + self.offset_width/2

    @property
    def pos_center_y(self):
        return self.offset_top + self.offset_height/2

    @property
    def area_size(self):
        return self.offset_width * self.offset_height

    # font features
    @property
    def font_color_popularity(self):
        return 0

    # text features
    num_chars = models.IntegerField()
    num_tags = models.IntegerField()
    num_links = models.IntegerField()

    @property
    def text_ratio(self):
        return self.width * self.height

    @property
    def tag_density(self):
        return self.num_tags / (self.num_chars + 1)

    @property
    def link_density(self):
        return self.num_links / (self.num_tags + 1)


class TestSet(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.TextField(default="")
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    sites = models.ManyToManyField(Site)
    pages = models.ManyToManyField(Page, blank=True)

    def __str__(self):
        return self.name


class ContentExtractor(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)


class Predict(models.Model):
    id = models.AutoField(primary_key=True)
    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    content_extractor = models.ForeignKey('ContentExtractor', on_delete=models.CASCADE)
    readable = models.BooleanField(default=False)

    class Meta:
        unique_together = [['page', 'content_extractor']]


class PredictIndex(models.Model):
    predict = models.ForeignKey(Predict, on_delete=models.CASCADE)
    predict_index = models.PositiveIntegerField()


class Answer(models.Model):
    id = models.AutoField(primary_key=True)
    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    checker = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)


class AnswerIndex(models.Model):
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    answer_index = models.PositiveIntegerField()


class PerformanceMetric(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)


class PerformanceEvaluationResult(models.Model):
    id = models.AutoField(primary_key=True)
    predict = models.ForeignKey(Predict, on_delete=models.CASCADE)
    performance_metric = models.ForeignKey(PerformanceMetric, on_delete=models.CASCADE)

    precision = models.FloatField(default=None, null=True)
    recall = models.FloatField(default=None, null=True)

    class Meta:
        unique_together = [['predict', 'performance_metric']]

    @property
    def f1(self):
        if self.precision is None or self. recall is None:
            return None
        elif self.recall + self.precision == 0:
            return 0.0
        else:
            return (2 * self.precision * self. recall) / (self.recall + self.precision)


