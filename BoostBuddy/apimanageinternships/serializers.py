from rest_framework import serializers
from .models import InternshipExperience

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternshipExperience
        fields = ['id','title', 'companyName','location',
        'contactInformation','startDate','endDate'
        ,'description','skillsGained','report','user','likes']