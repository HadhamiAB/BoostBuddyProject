from django.urls import path
from .views import addtip_view ,viewalltips_view,viewusertips_view, delete_tip_view,update_tip_view,like_tip

urlpatterns = [
    path('addtip/',addtip_view, name='addtip_api'),
    path('viewalltips/',viewalltips_view, name='viewalltips_api'),
    path('viewusertip/',viewusertips_view, name='viewusertip_api'),
    path('delete/<int:id>/',delete_tip_view, name='deletetip_api'),
    path('update/<int:id>/',update_tip_view, name='updateTip_api'),
    path('like_tip/<int:tip_id>/',like_tip, name='like_post_api'),

]
