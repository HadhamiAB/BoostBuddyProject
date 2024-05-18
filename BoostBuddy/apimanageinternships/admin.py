from django.contrib import admin
from .models import InternshipExperience
@admin.register(InternshipExperience)
class CustomIEAdmin(admin.ModelAdmin):
    search_fields = ['title', 'companyName',
 'location', 'contactInformation','startDate','endDate']
