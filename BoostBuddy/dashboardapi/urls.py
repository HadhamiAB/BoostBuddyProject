from django.urls import path
from .views import addpoints_view , time_spent_view,leaderboard_view, fetch_time_spent_data
urlpatterns = [
        path('addpoints/',addpoints_view, name='addpointsview_api'),
        path('timeSpent/',time_spent_view, name='timespentview_api'),
        path('timeSpent3d/',fetch_time_spent_data, name='fetchtimespentview_api'),
        path('leaderboard/',leaderboard_view, name='leaderboardview_api'),

]
