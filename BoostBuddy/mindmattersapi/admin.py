from django.contrib import admin
from .models import Tips
# Register your models here.
@admin.register(Tips)
class TipsAdmin(admin.ModelAdmin):
    search_fields = ['id', 'title']
