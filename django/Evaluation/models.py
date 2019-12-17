from django.db import models


class PerformanceMetric(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)


class PerformanceEvaluationResult(models.Model):
    id = models.AutoField(primary_key=True)
    predict = models.ForeignKey('Extractor.ContentExtractor', related_name='test2', on_delete=models.CASCADE)
    performance_metric = models.ForeignKey(PerformanceMetric,  related_name='test2', on_delete=models.CASCADE)

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
