from django.db import models
from django.core.validators import URLValidator
from django.conf import settings
from django.contrib.auth.models import User


class Site(models.Model):
    id = models.AutoField(primary_key=True)
    protocol = models.CharField(max_length=255, null=False, default='https')
    domain = models.CharField(max_length=255, null=False)
    name = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name if self.name else self.domain


class AnswerSet(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    description = models.TextField(default="")
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class TestSetSite(models.Model):
    id = models.AutoField(primary_key=True)
    test_set = models.ForeignKey(AnswerSet, on_delete=models.CASCADE)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)


class Page(models.Model):
    id = models.AutoField(primary_key=True)
    site = models.ForeignKey(Site, on_delete=models.SET_NULL, null=True)
    url = models.TextField(validators=[URLValidator()])
    title = models.TextField()
    depth = models.PositiveIntegerField()
    description = models.TextField()
    link = models.ForeignKey("self", on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True, null=True)
    modified = models.DateTimeField(auto_now=True, null=True)
    mht_file_path = models.FilePathField(null=True, path=settings.FILE_PATH_FIELD_DIRECTORY)


class TestSetPage(models.Model):
    id = models.AutoField(primary_key=True)
    test_set_site = models.ForeignKey(TestSetSite, on_delete=models.CASCADE)
    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True, null=True)


class Node(models.Model):

    id = models.AutoField(primary_key=True)
    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    hyu = models.PositiveIntegerField(null=False)

    pos_left = models.FloatField()
    pos_right = models.FloatField()
    pos_top = models.FloatField()
    pos_bottom = models.FloatField()

    @property
    def pos_center_x(self):
        return self.pos_left + self.width/2

    @property
    def pos_center_y(self):
        return self.pos_top + self.height/2

    @property
    def width(self):

        return self.pos_right - self.pos_left

    @property
    def height(self):
        return self.pos_bottom - self.pos_top

    @property
    def area_size(self):
        return self.width * self.height

    # font features

    @property
    def font_color_popularity(self):
        return 0

    # text features

    # text = models.IntegerField()
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

    label = models.IntegerField(choices=[(1, 'TEST'), (2, 'TEST'), (3, 'TEST')], null=False)

    class Meta:
        unique_together = [['page', 'hyu']]


class Answer(models.Model):
    id = models.AutoField(primary_key=True)
    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    checker = models.ForeignKey(User, on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)


class AnswerIndex(models.Model):
    answer = models.ForeignKey(Answer, on_delete=models.CASCADE)
    answer_index = models.PositiveIntegerField()


class ContentExtractor(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)


class Predict(models.Model):
    id = models.AutoField(primary_key=True)
    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    content_extractor = models.ForeignKey(ContentExtractor, on_delete=models.CASCADE)
    readable = models.BooleanField(default=False)
    # predict_dom = models.TextField(default=None, null=True)


class PredictIndex(models.Model):
    predict = models.ForeignKey(Predict, on_delete=models.CASCADE)
    predict_index = models.PositiveIntegerField()


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


