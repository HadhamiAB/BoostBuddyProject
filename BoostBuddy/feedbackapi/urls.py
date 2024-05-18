from django.urls import path
from .views import feedback_view

urlpatterns = [
    path('addfeedback/',feedback_view,name='feedback_api'),
]
