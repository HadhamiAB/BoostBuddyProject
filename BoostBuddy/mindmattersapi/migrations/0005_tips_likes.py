# Generated by Django 5.0.3 on 2024-04-27 04:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mindmattersapi', '0004_tips_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='tips',
            name='likes',
            field=models.IntegerField(default=0),
        ),
    ]
