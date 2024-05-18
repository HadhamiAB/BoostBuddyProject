from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    first_name=models.CharField(max_length=55)
    last_name=models.CharField(max_length=55)
    email=models.EmailField(unique=True)
    username=models.CharField(max_length=55 , unique=True)
    password=models.CharField(max_length=255)
    is_student=models.BooleanField(default=True)
    is_teacher=models.BooleanField(default=False)

    def __str__(self):
        return self.username