from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate,login,logout
from rest_framework.authtoken.models import Token

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(request, username=username, password=password)
    if user is not None:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({'success': True, 'username': user.username, 'user_id': user.id, 'token': token.key})
    else:
            return Response({'success': False, 'error': 'Invalid credentials'}, status=400)
    
@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'success': True})
