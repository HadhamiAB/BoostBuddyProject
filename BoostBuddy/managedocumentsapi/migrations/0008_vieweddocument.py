# Generated by Django 5.0.3 on 2024-03-29 03:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('managedocumentsapi', '0007_studypoints_last_viewed_document_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='ViewedDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('document_id', models.PositiveIntegerField()),
                ('study_points', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='managedocumentsapi.studypoints')),
            ],
        ),
    ]
