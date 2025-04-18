from rest_framework import serializers
from .models import Trade, Purchase
from pokemon.models import Pokemon

class TradeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trade
        fields = '__all__'

    def validate(self, data):
        # For trades, offered and requested cannot be the same
        if data['trade_type'] == 'trade' and data.get('pokemon_offered') == data.get('pokemon_requested'):
            raise serializers.ValidationError("Offered and requested Pokemon cannot be the same.")
        return data

class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = '__all__'