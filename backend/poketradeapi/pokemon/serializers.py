from .models import Pokemon
from rest_framework import serializers
from user.serializers import UserSerializer

class PokemonSerializer(serializers.ModelSerializer):
    owner_user = UserSerializer()

    class Meta:
        model = Pokemon
        fields = ['id', 'poke_dex_id', 'owner_user']
