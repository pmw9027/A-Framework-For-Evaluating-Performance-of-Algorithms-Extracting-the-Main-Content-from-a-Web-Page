from django.db import models
from Core.models import Page


class ContentExtractor(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name


class Predict(models.Model):

    id = models.AutoField(primary_key=True)
    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    content_extractor = models.ForeignKey('ContentExtractor', on_delete=models.CASCADE)
    readable = models.BooleanField(default=False)

    class Meta:
        unique_together = [['page', 'content_extractor']]

    def __str__(self):
        return f'{self.page} {self.content_extractor}'



class PredictIndex(models.Model):
    predict = models.ForeignKey(Predict, on_delete=models.CASCADE)
    predict_index = models.PositiveIntegerField()
