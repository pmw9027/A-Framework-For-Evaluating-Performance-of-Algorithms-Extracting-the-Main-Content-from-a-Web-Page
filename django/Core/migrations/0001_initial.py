# Generated by Django 2.1.5 on 2019-12-10 07:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('checker', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='AnswerIndex',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer_index', models.PositiveIntegerField()),
                ('answer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Core.Answer')),
            ],
        ),
        migrations.CreateModel(
            name='ContentExtractor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Node',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('hyu', models.PositiveIntegerField()),
                ('node_name', models.CharField(max_length=50)),
                ('offset_top', models.FloatField()),
                ('offset_left', models.FloatField()),
                ('offset_width', models.FloatField()),
                ('offset_height', models.FloatField()),
                ('num_chars', models.IntegerField()),
                ('num_tags', models.IntegerField()),
                ('num_links', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='NodeName',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
            ],
        ),
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('protocol', models.CharField(default='https', max_length=255)),
                ('host', models.CharField(max_length=255)),
                ('pathname', models.CharField(blank=True, max_length=255, null=True)),
                ('title', models.TextField(null=True)),
                ('description', models.TextField(null=True)),
                ('depth', models.PositiveIntegerField()),
                ('created', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified', models.DateTimeField(auto_now=True, null=True)),
                ('mht_file_path', models.FilePathField(null=True, path='./files')),
                ('link', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='Core.Page')),
            ],
        ),
        migrations.CreateModel(
            name='PerformanceEvaluationResult',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('precision', models.FloatField(default=None, null=True)),
                ('recall', models.FloatField(default=None, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PerformanceMetric',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Predict',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('readable', models.BooleanField(default=False)),
                ('content_extractor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Core.ContentExtractor')),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Core.Page')),
            ],
        ),
        migrations.CreateModel(
            name='PredictIndex',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('predict_index', models.PositiveIntegerField()),
                ('predict', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Core.Predict')),
            ],
        ),
        migrations.CreateModel(
            name='Site',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('protocol', models.CharField(default='https', max_length=255)),
                ('domain', models.CharField(max_length=255)),
                ('name', models.CharField(blank=True, max_length=255, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='TestSet',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('description', models.TextField(default='')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('creator', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('pages', models.ManyToManyField(to='Core.Page')),
                ('sites', models.ManyToManyField(to='Core.Site')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='site',
            unique_together={('protocol', 'domain')},
        ),
        migrations.AddField(
            model_name='performanceevaluationresult',
            name='performance_metric',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Core.PerformanceMetric'),
        ),
        migrations.AddField(
            model_name='performanceevaluationresult',
            name='predict',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Core.Predict'),
        ),
        migrations.AddField(
            model_name='page',
            name='site',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='Core.Site'),
        ),
        migrations.AddField(
            model_name='node',
            name='page',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Core.Page'),
        ),
        migrations.AddField(
            model_name='answer',
            name='page',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Core.Page'),
        ),
        migrations.AlterUniqueTogether(
            name='predict',
            unique_together={('page', 'content_extractor')},
        ),
        migrations.AlterUniqueTogether(
            name='performanceevaluationresult',
            unique_together={('predict', 'performance_metric')},
        ),
        migrations.AlterUniqueTogether(
            name='page',
            unique_together={('protocol', 'host', 'pathname')},
        ),
    ]
