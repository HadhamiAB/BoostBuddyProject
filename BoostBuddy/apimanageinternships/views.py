from rest_framework.decorators import api_view, authentication_classes
from rest_framework.response import Response
from .serializers import ExperienceSerializer
from .models import InternshipExperience 
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from django.http import JsonResponse


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def addIE_view(request):
    serializer=ExperienceSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        post=serializer.save(user=request.user) 
        print(request.user.id)
        return Response({'Success':True,'Post':post.title,'id':post.id})
    else:
        return Response(serializer.errors, status=400)
    
@api_view(['DELETE'])
def deleteposts_view(request ,id):
    try:
        post=InternshipExperience.objects.get(id=id)
    except InternshipExperience.DoesNotExist:
        return Response({'Error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
    try :
        post.delete()
    except Exception as e:
        return Response({'Error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({'Success': True, 'Message': f'Post with id {id} has been deleted.'})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def viewallposts(request):
    if request.method =='GET':
        if request.user.is_authenticated:
            post=InternshipExperience.objects.exclude(user=request.user)
            serializer=ExperienceSerializer(post,many=True)
            return Response(serializer.data)
        else:
            return JsonResponse({'status': 'User is not authenticated'}, status=400)
    else:
        return Response(serializer.errors,status=400)
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def like_post(request, post_id):
    if request.method =='POST':
        if request.user.is_authenticated:
            try:
                post = InternshipExperience.objects.get(id=post_id)
                post.likes += 1
                post.save()
                return JsonResponse({'status': 'Post liked successfully'}, status=200)
            except InternshipExperience.DoesNotExist:
                return JsonResponse({'status': 'Post not found'}, status=404)
        else:
            return JsonResponse({'status': 'User is not authenticated'}, status=400)
    else:
        return JsonResponse({'status': 'Invalid request'}, status=400)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def viewuserposts(request):
    if request.user.is_authenticated:
        post=InternshipExperience.objects.filter(user=request.user)
        serializer=ExperienceSerializer(post,many=True)
        return Response(serializer.data)
    else:
        return JsonResponse({'status': 'User is not authenticated'}, status=400)
    
@api_view(['GET', 'PUT'])
def update_post_view(request,id):
    try:
        post = InternshipExperience.objects.get(id=id)   
    except post.DoesNotExist:
        return Response({"error": "post not found"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':    
        serializer=ExperienceSerializer(post)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = ExperienceSerializer(post, data=request.data, partial=True)  
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            print(serializer.errors) 
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)       
