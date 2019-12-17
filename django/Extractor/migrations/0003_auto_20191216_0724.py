# Generated by Django 2.1.5 on 2019-12-16 07:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Core', '0004_answer_indices'),
        ('Extractor', '0002_auto_20191216_0703'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='predictindex',
            name='predict',
        ),
        migrations.AddField(
            model_name='predict',
            name='indices',
            field=models.ManyToManyField(blank=True, to='Core.Node'),
        ),
        migrations.DeleteModel(
            name='PredictIndex',
        ),
    ]