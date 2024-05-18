from django.contrib import admin
from .models import User


@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    search_fields = ['first_name', 'last_name', 'email', 'username']