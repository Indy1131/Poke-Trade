from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
from pokemon.models import Pokemon
from trade.models import Trade, Transaction


class TradeRouteTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # Create users
        self.user1 = User.objects.create_user(username='ash', password='pikachu123')
        self.user2 = User.objects.create_user(username='misty', password='staryu456')

        # Create Pokémon
        self.pokemon1 = Pokemon.objects.create(poke_dex_id=25, owner_user=self.user1)
        self.pokemon2 = Pokemon.objects.create(poke_dex_id=120, owner_user=self.user2)

        # Create a trade offer: user1 offers their Pokemon for user2's
        self.trade = Trade.objects.create(
            requester=self.user1,
            recipient=self.user2,
            pokemon_offered=self.pokemon1,
            pokemon_requested=self.pokemon2,
            status='pending'
        )

    def test_get_offers(self):
        self.client.force_authenticate(user=self.user2)  # owner of requested Pokemon
        response = self.client.get('/trade/offers/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.trade.id)

    def test_get_outbound(self):
        self.client.force_authenticate(user=self.user1)  # owner of offered Pokemon
        response = self.client.get('/trade/outbound/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.trade.id)

    def test_accept_offer(self):
        self.client.force_authenticate(user=self.user2)

        response = self.client.post(f'/trade/accept/{self.trade.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.trade.refresh_from_db()
        self.pokemon1.refresh_from_db()
        self.pokemon2.refresh_from_db()

        # Ownership should be swapped
        self.assertEqual(self.pokemon1.owner_user, self.user2)
        self.assertEqual(self.pokemon2.owner_user, self.user1)

        # Trade should be completed
        self.assertEqual(self.trade.status, 'completed')

        # A transaction should be recorded
        transactions = Transaction.objects.filter(trade=self.trade)
        self.assertEqual(transactions.count(), 1)
        self.assertEqual(transactions.first().buyer, self.user1)

    def test_reject_trade(self):
        self.client.force_authenticate(user=self.user2)

        response = self.client.delete(f'/trade/reject/{self.trade.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.assertFalse(Trade.objects.filter(id=self.trade.id).exists())

    def test_get_transactions(self):
        # Accept the trade first to create a transaction
        self.client.force_authenticate(user=self.user2)
        self.client.post(f'/trade/accept/{self.trade.id}/')

        self.client.force_authenticate(user=self.user1)
        response = self.client.get('/trade/transactions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

        self.client.force_authenticate(user=self.user2)
        response = self.client.get('/trade/transactions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
