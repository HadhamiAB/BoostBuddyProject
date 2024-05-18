from django.db import models
from django.conf import settings


class Tips(models.Model):
    title=models.CharField()
    tip=models.CharField()
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    likes = models.IntegerField(default=0)  

    def __str__(self) :
        return self.title
    
