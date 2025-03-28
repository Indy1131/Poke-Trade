from django.shortcuts import render
from pokemon.models import Pokemon
from rest_framework.decorators import api_view
from rest_framework.response import Response
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
    
@api_view(['PUT'])
def create_pokemon(request):
    try:
        serializer = PokemonSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data = {'detail':'pokemon successfully created'},status = status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)

        

