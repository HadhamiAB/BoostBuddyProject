from django.db import models

# Create your models here.
class feedback(models.Model):
    name=models.CharField(max_length=100)
    email=models.EmailField()
    contactNumber=models.CharField(max_length=20)#, null=True, blank=True
    comment=models.CharField()

    def __str__(self):
        return self.name