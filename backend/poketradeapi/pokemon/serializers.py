from .models import Pokemon
from rest_framework import serializers

class PokemonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pokemon
        fields = ['id', 'poke_dex_id', 'owner_user']
