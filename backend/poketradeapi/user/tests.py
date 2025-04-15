from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
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

class AdminUserManagementTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(username="admin", email="admin@test.com", password="adminpass")
        self.regular_user = User.objects.create_user(username="ash", email="ash@poke.com", password="pikachu123")

        self.client = APIClient()
        self.client.force_authenticate(user=self.admin_user)

    def test_admin_can_view_user_detail(self):
        url = reverse("get_user", kwargs={"user_id": self.regular_user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "ash")

    def test_admin_can_update_user(self):
        url = reverse("update_user", kwargs={"user_id": self.regular_user.id})
        data = {"email": "updated@poke.com"}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "updated@poke.com")

    def test_admin_can_delete_user(self):
        url = reverse("delete_user", kwargs={"user_id": self.regular_user.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(User.objects.filter(id=self.regular_user.id).exists())