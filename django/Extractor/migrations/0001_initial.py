# Generated by Django 2.1.5 on 2019-12-15 07:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Core', '0003_auto_20191215_0733'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContentExtractor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Predict',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('readable', models.BooleanField(default=False)),
                ('content_extractor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Extractor.ContentExtractor')),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Core.Page')),
            ],
        ),
        migrations.CreateModel(
            name='PredictIndex',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('predict_index', models.PositiveIntegerField()),
                ('predict', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Extractor.Predict')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='predict',
            unique_together={('page', 'content_extractor')},
        ),
    ]
