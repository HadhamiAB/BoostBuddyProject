from django.urls import path
from .views import signup_view ,manageprofile_view

urlpatterns = [
    path('signup/',signup_view, name='Signup_api'),
    path('manageprofile/<int:userId>/',manageprofile_view, name='manageprofile_api'),
]
