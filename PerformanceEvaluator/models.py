from django.db import models
from Core.models import Page, Answer, Predict


class Performance(models.Model):
    performance_number = models.AutoField(primary_key=True)
    page_number = models.ForeignKey(Page, on_delete=models.CASCADE)
    answer_number = models.ForeignKey(Answer, on_delete=models.CASCADE)
    predict_number = models.ForeignKey(Predict, on_delete=models.CASCADE)
    performance_metric = models.TextField(default=None, null=True)
    performance_precision = models.FloatField(default=None, null=True)
    performance_recall = models.FloatField(default=None, null=True)
    performance_f1 = models.FloatField(default=None, null=True)
