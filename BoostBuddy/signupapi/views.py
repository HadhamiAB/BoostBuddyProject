from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSerializer
from .models import User
from rest_framework import status

@api_view(['POST'])
def signup_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'Success': True, 'username': user.username, 'user_id': user.id})
    else:
        return Response(serializer.errors, status=400)

@api_view(['GET', 'PUT'])
def manageprofile_view(request,userId):
    try:
        user=User.objects.get(id=userId)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':    
        serializer=UserSerializer(user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        # partial=True allows partial updates with PUT
        serializer = UserSerializer(user, data=request.data, partial=True)  
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    else:
        return Response({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)