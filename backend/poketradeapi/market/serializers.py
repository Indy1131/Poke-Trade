from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Balance, Bids, Asks, Listing, ListingContent
from pokemon.serializers import PokemonSerializer
from user.serializers import UserSerializer

class BalanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Balance
        fields = '__all__'

class BidsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bids
        fields = '__all__'

class AsksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asks
        fields = '__all__'

class ListingContentSerializer(serializers.ModelSerializer):
    pokemon = PokemonSerializer(many=True, read_only=True)

    class Meta:
        model = ListingContent
        fields = ['id', 'pokemon', 'currency']

class ListingSerializer(serializers.ModelSerializer):
    offer = ListingContentSerializer()
    ask = ListingContentSerializer()
    owner = UserSerializer()

    class Meta:
        model = Listing
        fields = '__all__'