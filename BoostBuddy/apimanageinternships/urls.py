from django.urls import path
from .views import addIE_view , viewallposts,deleteposts_view ,update_post_view,viewuserposts ,like_post
urlpatterns = [
    path('addIE/',addIE_view, name='AddInternship_api'),
    path('deleteIE/<int:id>/',deleteposts_view, name='deletePost_api'),
    path('updateIE/<int:id>/',update_post_view, name='updatepost_api'),
    path('viewallposts/',viewallposts, name='viewallPost_api'),
    path('like_post/<int:post_id>/',like_post, name='like_post_api'),
    path('viewuserposts/',viewuserposts, name='viewuserPost_api'),


]
