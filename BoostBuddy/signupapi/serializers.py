from rest_framework import serializers
from .models import User 
from django.contrib.auth.hashers import make_password

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username', 
                  'password', 'is_student', 'is_teacher']
        #stop serializer from hashing pwd
        extra_kwargs = {'password': {'write_only': True}}

        #security algorithm / pwd hashing
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    
    def update(self, instance, validated_data): #userserializrer , user,newpwd
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)