from rest_framework import serializers
from .models import Document , StudyPoints,ViewedDocument,AddedDocument,UserTimeSpent,Rating

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id','title', 'type', 'content', 
        'date_added', 'speciality', 'subject_name',
          'year','file' , 'user']

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ['id','document', 'user', 'value']
        
class ViewedDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ViewedDocument
        fields = ['document_id'] 
class AddedDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddedDocument
        fields = ['document_id']
class StudyPointsSerializer(serializers.ModelSerializer):
    viewed_documents = ViewedDocumentSerializer(many=True, read_only=True)
    added_documents = AddedDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = StudyPoints
        fields = ['user', 'DocumentsViewed', 'DocumentsDownloaded'
                  , 'DocumentsAdded', 'viewed_documents','added_documents']
      
class UserTimeSpentSerializer(serializers.Serializer):
    model=UserTimeSpent
    fields=['user','TimeSpent','documeny_id']