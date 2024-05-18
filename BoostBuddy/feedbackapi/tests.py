from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

class FeedbackAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_valid_feedback_submission(self):
        data = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'comment': 'This is a test feedback.'
        }
        response = self.client.post('/feedbackapi/addfeedback/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['Success'], True)
        self.assertTrue('feedback' in response.data)
        self.assertTrue('message' in response.data)

    def test_invalid_feedback_submission(self):
        data = {
            'name': '',  # Invalid data: Name is required
            'email': 'john@example.com',
            'comment': 'This is a test feedback.'
        }
        response = self.client.post('/feedbackapi/addfeedback/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        # Add more assertions based on expected behavior for invalid data

    # Add more test cases as needed to cover different scenarios
