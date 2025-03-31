from django.shortcuts import render
from pokemon.models import Pokemon
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializers import PokemonSerializer

@api_view(['GET'])
def get_pokemon(request, pokemon_id):
    try:
        pokemon = Pokemon.objects.get(pk = pokemon_id)
        serializer = PokemonSerializer(pokemon)
        return Response(data = serializer.data, status = status.HTTP_200_OK)
    except(Pokemon.DoesNotExist):
        return Response(data = {'detail':'pokemon not found'}, status = status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
# @permission_classes([IsAuthenticated])  # Ensure only logged-in users can access this endpoint
def user_pokemon_collection(request):
    user_pokemon = Pokemon.objects.filter(owner_user=request.user)  # Get Pokémon owned by the logged-in user
    serializer = PokemonSerializer(user_pokemon, many=True)
    return Response(serializer.data)  # Return JSON response