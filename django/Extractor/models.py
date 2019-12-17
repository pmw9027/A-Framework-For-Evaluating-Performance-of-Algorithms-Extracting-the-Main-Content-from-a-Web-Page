from django.db import models


class ContentExtractor(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(null=True, blank=True)
    performance = models.ManyToManyField('Evaluation.PerformanceMetric', through='Evaluation.PerformanceEvaluationResult')

    def __str__(self):
        return self.name


class Predict(models.Model):

    id = models.AutoField(primary_key=True)
    page = models.ForeignKey('Core.Page', related_name='test', on_delete=models.SET_NULL, null=True)
    content_extractor = models.ForeignKey(ContentExtractor, related_name='extractor', on_delete=models.SET_NULL, null=True)
    readable = models.BooleanField(default=False)
    indices = models.ManyToManyField('Core.Node', blank=True)

    class Meta:
        unique_together = [['content_extractor', 'page']]

    def __str__(self):
        return f'{self.page} {self.content_extractor}'
