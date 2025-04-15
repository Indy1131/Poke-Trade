from django.test import TestCase

# Create your tests here.
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from pokemon.models import Pokemon
from market.models import Listing, ListingContent
from rest_framework import status

class AdminListingTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(
            username='admin', email='admin@test.com', password='adminpass'
        )
        self.user = User.objects.create_user(
            username='testuser', email='test@example.com', password='userpass'
        )

        self.client = APIClient()
        self.client.force_authenticate(user=self.admin_user)

        # Create Pokémon
        self.p1 = Pokemon.objects.create(poke_dex_id=1, owner_user=self.user)
        self.p2 = Pokemon.objects.create(poke_dex_id=2, owner_user=self.user)

        # Create Listing
        offer = ListingContent.objects.create()
        ask = ListingContent.objects.create()
        offer.pokemon.add(self.p1)
        ask.pokemon.add(self.p2)

        self.listing = Listing.objects.create(owner=self.user, offer=offer, ask=ask)

    def test_update_listing(self):
        url = f'/api/market/admin/listings/{self.listing.id}/update/'
        data = {
            'status': 'CLOSED',
            'offer_currency': 100,
            'offer_pokemon_ids': [self.p2.id],
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.listing.refresh_from_db()
        self.assertEqual(self.listing.status, 'CLOSED')
        self.assertEqual(self.listing.offer.currency, 100)

    def test_delete_listing(self):
        url = f'/api/market/admin/listings/{self.listing.id}/delete/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Listing.objects.filter(id=self.listing.id).exists())
