from rest_framework import serializers
from .models import Trade, Listing, Transaction
from pokemon.serializers import PokemonSerializer
from user.serializers import UserSerializer

class TradeSerializer(serializers.ModelSerializer):
    original = PokemonSerializer()
    offer = PokemonSerializer()

    class Meta:
        model = Trade
        fields = ['id', 'original', 'offer']

class ListingSerializer(serializers.ModelSerializer):
    pokemon = PokemonSerializer()

    class Meta:
        model = Listing
        fields = ['id', 'pokemon', 'price', 'completed'] 

class TransactionSerializer(serializers.ModelSerializer):
    buyer = UserSerializer()
    seller = UserSerializer()
    info = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = ['buyer', 'seller', 'created_at', 'type', 'info', 'id']

    def get_type(self, obj):
        return obj.content_type.model

    def get_info(self, obj):
        if obj.info:
            model_name = obj.content_type.model
            if model_name == "listing":
                return ListingSerializer(obj.info).data
            else:
                return TradeSerializer(obj.info).data
        return None