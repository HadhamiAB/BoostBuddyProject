# Generated by Django 5.0.3 on 2024-03-23 01:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('feedbackapi', '0007_alter_feedback_contactnumber'),
    ]

    operations = [
        migrations.AlterField(
            model_name='feedback',
            name='contactNumber',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
