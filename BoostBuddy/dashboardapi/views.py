from rest_framework.decorators import api_view, authentication_classes
from managedocumentsapi.models import StudyPoints,UserTimeSpent,Document,UserTimeSpent3D
from managedocumentsapi.serializers import StudyPointsSerializer
from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from django.db.models import Sum
from django.db.models import F


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def addpoints_view(request):
    if request.user.is_authenticated:
        study_points = StudyPoints.objects.filter(user=request.user)
        timespent=UserTimeSpent.objects.filter(user=request.user)
        data = []
        for points in study_points:
            for time in timespent:
                data.append({
                'UserId': points.user.id,
                'DocumentsViewed': points.DocumentsViewed,
                'DocumentsDownloaded': points.DocumentsDownloaded,
                'DocumentsAdded': points.DocumentsAdded,
                'TimeSpent':time.TimeSpent,
            })

        return Response(data)
    else:
            return JsonResponse({'status': 'User is not authenticated'}, status=400)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def time_spent_view(request):
    if request.user.is_authenticated:
        timespent = UserTimeSpent.objects.filter(user=request.user)
        data = []
        for record in timespent:
            document_title = Document.objects.get(id=record.document_id).title
            data.append({
                'document_title': document_title,
                'total_time': record.TimeSpent
            })
        return Response(data)
    else:
        return JsonResponse({'status': 'User is not authenticated'}, status=400)
    
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def leaderboard_view(request):
    if request.user.is_authenticated:
        study_points = StudyPoints.objects.all().annotate(
            total_points=F('DocumentsViewed') + F('DocumentsDownloaded') + F('DocumentsAdded')
        ).values('user__username', 'total_points')
        data = list(study_points)
        data.sort(key=lambda x: x['total_points'], reverse=True)
        return Response(data)
    else:
        return JsonResponse({'status': 'User is not authenticated'}, status=400)
    
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def fetch_time_spent_data(request):
    time_spent_data = UserTimeSpent3D.objects.values('user__username', 'document__title', 'TimeSpent')  # Use UserTimeSpent3D instead of UserTimeSpent
    users = list(time_spent_data.values_list('user__username', flat=True).distinct())
    documents = list(time_spent_data.values_list('document__title', flat=True).distinct())
    time_spent = [[0 for _ in range(len(documents))] for _ in range(len(users))]
    for record in time_spent_data:
        user_index = users.index(record['user__username'])
        document_index = documents.index(record['document__title'])
        time_spent[user_index][document_index] = record['TimeSpent']
    return JsonResponse({
        'users': users,
        'documents': documents,
        'time_spent': time_spent,
    })
