from django.contrib import admin
from .models import feedback
# Register your models here.
@admin.register(feedback)
class CustomFeedbackAdmin(admin.ModelAdmin):
    search_fields = ['name', 'email']