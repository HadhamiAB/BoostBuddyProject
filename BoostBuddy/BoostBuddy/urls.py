from django.contrib import admin
from django.urls import path , include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('apisignup/',include('signupapi.urls')),
    path('apilogin/',include('loginapi.urls')),
    path('apimanagedocuments/',include('managedocumentsapi.urls')),
    path('apimanageinternships/',include('apimanageinternships.urls')),
    path('feedbackapi/',include('feedbackapi.urls')),
    path('mindmattersapi/',include('mindmattersapi.urls')),
    path('dashboardapi/',include('dashboardapi.urls')),
    #path('chatbotapi/',include('chatbot.urls')),
]
