from django.db import models
from django.conf import settings


class InternshipExperience(models.Model):
    title = models.CharField(max_length=200)
    companyName = models.TextField()
    location = models.TextField()
    contactInformation = models.TextField()
    startDate = models.DateField()
    endDate = models.DateField()
    description = models.TextField()
    skillsGained = models.TextField()
    report = models.FileField(upload_to='internshipexperiences/') 
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    likes = models.IntegerField(default=0)  

    def __str__(self):
        return self.title 


