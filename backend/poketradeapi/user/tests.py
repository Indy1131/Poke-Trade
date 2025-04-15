from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from pokemon.models import Pokemon

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
        
    def test_create_user_missing_password(self):
        url = reverse('create_user')  # Replace with your actual URL name
        payload = {
            "username": "newuser",
            "email": "new@poketrade.com"
            # password is intentionally omitted
        }
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_create_user_missing_email(self):
        url = reverse('create_user')  # Replace with your actual URL name
        payload = {
            "username": "newuser",
            "password": "testpass"
            #email is intentionally omitted
        }
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)

    def test_create_user_generates_three_random_pokemon(self):
        url = reverse('create_user')
        payload = {
            "username": "poketest",
            "password": "testpass",
            "email": "poke@poketrade.com"
        }
        response = self.client.put(url,payload,format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = User.objects.get(username = "poketest")
        pokemons = user.owned_pokemon.all()
        self.assertEqual(pokemons.count(), 3)

