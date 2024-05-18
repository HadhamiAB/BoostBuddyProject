from django.urls import path
from .views import addDocument_view , viewdocument_view ,delete_document_view,update_document_view,serve_pdf_view ,UpdateStudyPointsView ,UpdateDownloadPointsView,UpdateADDPointsView , viewuserdocument,update_time_spent,rate_document_view,get_rating_counts_view,get_document_details
 #,getdocument_view,,getSubjectBySpeciality
urlpatterns = [
    path('add/',addDocument_view, name='AddDocument_api'),
    path('delete/<int:id>/',delete_document_view, name='deleteDocument_api'),
    path('update/<int:id>/',update_document_view, name='updateDocument_api'),
    path('update_studypoints/<int:documentId>/', UpdateStudyPointsView, name='update_study_points'),
    path('updatedownloadpoints/<int:documentId>/', UpdateDownloadPointsView, name='update_download_points'),
    path('updateaddpoints/<int:documentId>/', UpdateADDPointsView, name='update_ADD_points'),
    path('servepdf/<int:id>/', serve_pdf_view, name='servepdf'),
    path('getdetails/<int:documentId>/', get_document_details, name='getdetails'),
    path('sendrate/<int:document_id>/', rate_document_view, name='ratesending'),  
    path('getrate/<int:document_id>/', get_rating_counts_view, name='ratecount'), 
    path('view/',viewdocument_view, name='viewDocument_api'),
    path('viewuserdocuments/',viewuserdocument, name='viewuserDocument_api'),
    path('time-spent/<int:document_id>/', update_time_spent),

    #path('subjects/<slug:speciality>/', getSubjectBySpeciality, name='subject-list'),

]
