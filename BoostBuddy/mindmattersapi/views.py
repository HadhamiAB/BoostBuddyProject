from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from .serializers import TipsSerializer
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from .models import Tips
from django.http import JsonResponse

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def addtip_view(request):
    if request.method == 'POST':
        data = request.data.copy()  # Make a mutable copy of the data
        data['user'] = request.user.id  # Add the user id to the data
        serializer = TipsSerializer(data=data)
        if serializer.is_valid():
            tip = serializer.save()
           # print(tip.id)
            return Response({'Success': True, 'Tip': tip.title, 'id': tip.id})
        else:
            return Response(serializer.errors, status=400)
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def viewalltips_view(request):
    if request.user.is_authenticated:
        tips = Tips.objects.exclude(user=request.user)
        serializer = TipsSerializer(tips, many=True)
        return Response(serializer.data)
    else:
        return JsonResponse({'status': 'User is not authenticated'}, status=400)    
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def viewusertips_view(request):
   if request.user.is_authenticated:
        tips = Tips.objects.filter(user=request.user)
        serializer = TipsSerializer(tips, many=True)
        return Response(serializer.data)
   else:
        return JsonResponse({'status': 'User is not authenticated'}, status=400)

@api_view(['DELETE'])
def delete_tip_view(request ,id):
    try:
            tip = Tips.objects.get(id=id)
    except tip.DoesNotExist:
        return Response({'Error': 'Tip not found'}, status=status.HTTP_404_NOT_FOUND)
    try :
        tip.delete()
    except Exception as e:
        return Response({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({'Success': True, 'Message': f'Tip with id {id} has been deleted.'})
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def like_tip(request, tip_id):
    if request.method =='POST':
        if request.user.is_authenticated:
            try:
                tippost = Tips.objects.get(id=tip_id)
                tippost.likes += 1
                tippost.save()
                return JsonResponse({'status': 'Tip liked successfully'}, status=200)
            except Tips.DoesNotExist:
                return JsonResponse({'status': 'Tip not found'}, status=404)
        else:
            return JsonResponse({'status': 'User is not authenticated'}, status=400)
    else:
        return JsonResponse({'status': 'Invalid request'}, status=400)

@api_view(['GET', 'PUT'])
@authentication_classes([TokenAuthentication])
def update_tip_view(request,id):
    try:
            tip = Tips.objects.get(id=id)   
    except Tips.DoesNotExist:
        return Response({"error": "tip not found"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':    
        serializer=TipsSerializer(tip)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = TipsSerializer(tip, data=request.data, partial=True)  
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)