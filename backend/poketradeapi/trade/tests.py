from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient, APITestCase
from rest_framework import status
from pokemon.models import Pokemon
from trade.models import Trade

class TradeModelTests(APITestCase):

    def setUp(self):
        self.user1 = User.objects.create_user(username='ash', password='pikachu123')
        self.user2 = User.objects.create_user(username='misty', password='togepi123')

        self.pokemon1 = Pokemon.objects.create(poke_dex_id=1, owner_user=self.user1)
        self.pokemon2 = Pokemon.objects.create(poke_dex_id=2, owner_user=self.user2)

    def test_create_trade_request(self):
        self.client.force_authenticate(user=self.user1)

        response = self.client.post('/trade/create/', {
            'recipient': self.user2.id,
            'pokemon_requested': self.pokemon2.id,
            'pokemon_offered': self.pokemon1.id,
            'trade_type': 'trade',
        })

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Trade.objects.count(), 1)

    def test_create_purchase_request(self):
        self.client.force_authenticate(user=self.user1)

        response = self.client.post('/trade/create/', {
            'recipient': self.user2.id,
            'pokemon_requested': self.pokemon2.id,
            'trade_type': 'purchase',
        })

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Trade.objects.first().trade_type, 'purchase')

    def test_get_user_trades(self):
        Trade.objects.create(
            requester=self.user1,
            recipient=self.user2,
            pokemon_requested=self.pokemon2,
            pokemon_offered=self.pokemon1,
            trade_type='trade'
        )

        self.client.force_authenticate(user=self.user1)
        response = self.client.get('/trade/my-trades/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_incoming_requests(self):
        Trade.objects.create(
            requester=self.user1,
            recipient=self.user2,
            pokemon_requested=self.pokemon2,
            pokemon_offered=self.pokemon1,
            trade_type='trade'
        )

        self.client.force_authenticate(user=self.user2)
        response = self.client.get('/trade/incoming/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_trade_status(self):
        trade = Trade.objects.create(
            requester=self.user1,
            recipient=self.user2,
            pokemon_requested=self.pokemon2,
            trade_type='purchase'
        )

        self.client.force_authenticate(user=self.user2)
        response = self.client.post(f'/trade/update-status/{trade.id}/', {'status': 'approved'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_status_update(self):
        trade = Trade.objects.create(
            requester=self.user1,
            recipient=self.user2,
            pokemon_requested=self.pokemon2,
            trade_type='purchase'
        )

        self.client.force_authenticate(user=self.user2)
        response = self.client.post(f'/trade/update-status/{trade.id}/', {'status': 'unknown'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_accept_purchase_request_transfers_ownership(self):
        trade = Trade.objects.create(
            requester=self.user1,
            recipient=self.user2,
            pokemon_requested=self.pokemon2,
            trade_type='purchase'
        )

        self.client.force_authenticate(user=self.user2)
        response = self.client.post(f'/trade/update-status/{trade.id}/', {'status': 'approved'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        trade.refresh_from_db()
        self.pokemon2.refresh_from_db()
        self.assertEqual(trade.status, 'completed')
        self.assertEqual(self.pokemon2.owner_user, self.user1)

    def test_accept_trade_request_swaps_ownership(self):
        trade = Trade.objects.create(
            requester=self.user1,
            recipient=self.user2,
            pokemon_requested=self.pokemon2,
            pokemon_offered=self.pokemon1,
            trade_type='trade'
        )

        self.client.force_authenticate(user=self.user2)
        response = self.client.post(f'/trade/update-status/{trade.id}/', {'status': 'approved'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.pokemon1.refresh_from_db()
        self.pokemon2.refresh_from_db()
        self.assertEqual(self.pokemon1.owner_user, self.user2)
        self.assertEqual(self.pokemon2.owner_user, self.user1)

    def test_decline_trade_does_not_change_ownership(self):
        trade = Trade.objects.create(
            requester=self.user1,
            recipient=self.user2,
            pokemon_requested=self.pokemon2,
            pokemon_offered=self.pokemon1,
            trade_type='trade'
        )

        self.client.force_authenticate(user=self.user2)
        response = self.client.post(f'/trade/update-status/{trade.id}/', {'status': 'rejected'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        trade.refresh_from_db()
        self.pokemon1.refresh_from_db()
        self.pokemon2.refresh_from_db()
        self.assertEqual(trade.status, 'rejected')
        self.assertEqual(self.pokemon1.owner_user, self.user1)
        self.assertEqual(self.pokemon2.owner_user, self.user2)
