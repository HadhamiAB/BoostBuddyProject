from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import feedbackSerializer
#from django.core.mail import send_mail

@api_view(['POST'])
def feedback_view(request):
    if request.method =='POST':
        serializer=feedbackSerializer(data=request.data)
        if serializer.is_valid():
            feedback=  serializer.save()
            return Response({'Success': True, 'feedback': feedback.id, 'message': 'Feedback saved successfully.'})
        else:
            return Response(serializer.errors, status=400)
    else:
        return Response({'error': 'Invalid request method.'}, status=405)












"""def feedback_view(request):
    if request.method =='POST':
        serializer=feedbackSerializer(data=request.data)
        if serializer.is_valid():
            feedback=  serializer.save()
            subject='Feedback on BoostBuddy from {}'.format(feedback.name)
            message = 'Message: {}\nContact Number: {}'.format(
                feedback.comment,
                feedback.contactNumber
            )
            sender_email = feedback.email
            recipient_email = 'boostbuddyfeedback@gmail.com'  
            try:
                send_mail(subject, message, sender_email, [recipient_email])
                return Response({'Success': True, 'feedback': feedback.id, 'message': 'Feedback sent successfully.'})
            except Exception as e:
                print(e)
                return Response({'Success': False, 'error': 'Failed to send email.', 'message': str(e)}, status=500)
        else:
            return Response(serializer.errors, status=400)
    else:
        return Response({'error': 'Invalid request method.'}, status=405)"""

