from rest_framework import serializers
from .models import feedback

class feedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model=feedback
        fields=['id','name','email','contactNumber','comment']









""" def create(self, validated_data):
        
        Create and return a new `feedback` instance, given the validated data.
       
        return feedback.objects.create(**validated_data) """