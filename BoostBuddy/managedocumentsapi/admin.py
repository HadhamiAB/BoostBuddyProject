from django.contrib import admin
from .models import Document , StudyPoints,UserTimeSpent,Rating
# Register your models here.
@admin.register(Document)
class CustomDocumentAdmin(admin.ModelAdmin):
    search_fields = ['title', 'type', 'date_added', 'speciality','subject_name','year','user']

@admin.register(StudyPoints)
class CustomSudyPointsAdmin(admin.ModelAdmin):
    search_fields = ['user__username','DocumentsViewed', 
                     'DocumentsDownloaded', 'DocumentsAdded','vieweddocument__document_id']
@admin.register(UserTimeSpent)
class CustomUserTimeSpentAdmin(admin.ModelAdmin):
    search_fields = ['user__username','TimeSpent', 'document_id']
@admin.register(Rating)
class CustomRatingAdmin(admin.ModelAdmin):
    search_fields = ['user__username','value', 'document_id']