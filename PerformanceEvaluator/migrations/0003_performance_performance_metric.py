# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2018-10-10 11:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('PerformanceEvaluator', '0002_auto_20181010_1939'),
    ]

    operations = [
        migrations.AddField(
            model_name='performance',
            name='performance_metric',
            field=models.TextField(default=None, null=True),
        ),
    ]