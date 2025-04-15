from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User

class AuthTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='UnitTestUser',
            email='ash@poketrade.com',
            password='pikachu123'
        )

    def test_login(self):
        url = reverse('token_obtain_pair')
        response = self.client.post(url, {
            "username": "UnitTestUser",
            "password": "pikachu123"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_refresh_token(self):
        login_url = reverse('token_obtain_pair')
        refresh_url = reverse('token_refresh')
        login_res = self.client.post(login_url, {
            "username": "UnitTestUser",
            "password": "pikachu123"
        })
        refresh_token = login_res.data['refresh']
        response = self.client.post(refresh_url, {"refresh": refresh_token})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_logout(self):
        login_url = reverse('token_obtain_pair')
        logout_url = reverse('logout_user')
        login_res = self.client.post(login_url, {
            "username": "UnitTestUser",
            "password": "pikachu123"
        })
        refresh_token = login_res.data['refresh']
        response = self.client.post(logout_url, {"refresh": refresh_token})
        self.assertEqual(response.status_code, status.HTTP_205_RESET_CONTENT)

    def test_password_reset_request(self):
        url = reverse('password_reset:reset-password-request')
        response = self.client.post(url, {"email": "ash@poketrade.com"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
