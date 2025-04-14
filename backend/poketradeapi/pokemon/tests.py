from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from pokemon.models import Pokemon

class PokemonViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='password123',
            email='test@poke.com'
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        # Create one test Pokémon
        self.pokemon = Pokemon.objects.create(
            owner_user=self.user,
            poke_dex_id=25  # Pikachu, for example
        )

    def test_get_existing_pokemon(self):
        url = reverse('get_pokemon', args=[self.pokemon.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['poke_dex_id'], 25)

    def test_get_nonexistent_pokemon(self):
        url = reverse('get_pokemon', args=[9999])  # Assuming this doesn't exist
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_pokemon(self):
        url = reverse('create_pokemon')
        payload = {
            'owner_user': self.user.id,
            'poke_dex_id': 4  # Charmander
        }
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Pokemon.objects.filter(owner_user=self.user, poke_dex_id=4).count(), 1)

    def test_get_user_pokemon(self):
        url = reverse('get_user_pokemon')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['poke_dex_id'], 25)

    def test_get_user_pokemon_unauthenticated(self):
        self.client.logout()
        url = reverse('get_user_pokemon')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_pokemon_with_search_match(self):
        url = reverse('get_user_pokemon') + '?search=pika'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertIn('api_data', response.data[0])
        self.assertIn('pika', response.data[0]['api_data']['name'])

    def test_get_user_pokemon_with_search_no_match(self):
        url = reverse('get_user_pokemon') + '?search=charizard'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_create_pokemon_missing_fields(self):
        url = reverse('create_pokemon')
        payload = {'owner_user': self.user.id}  # Missing poke_dex_id
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('poke_dex_id', response.data)

    def test_get_pokemon_includes_api_data(self):
        url = reverse('get_pokemon', args=[self.pokemon.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('api_data', response.data)
        self.assertIn('sprite', response.data['api_data'])