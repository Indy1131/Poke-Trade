from django.shortcuts import render
from pokemon.models import Pokemon
from trade.models import Listing
from trade.serializers import ListingSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import PokemonSerializer
from .utils import fetch_pokeapi_data

@api_view(['GET'])
def get_pokemon(request, pokemon_id):
    try:
        pokemon = Pokemon.objects.get(pk = pokemon_id)
        serializer = PokemonSerializer(pokemon)
        
        api_data = fetch_pokeapi_data(serializer.data['poke_dex_id'])
        data = dict(serializer.data)
        data['api_data'] = api_data or {}

        try:
            listing = Listing.objects.get(pokemon=pokemon, completed=False)
            listing_data = ListingSerializer(listing).data
            data['listing_price'] = listing_data['price']
            data['listing_id'] = listing_data['id']
        except Listing.DoesNotExist:
            data['listing_price'] = None

        return Response(data = data, status = status.HTTP_200_OK)
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
    
@api_view(['GET'])
def get_user_pokemon(request):
    user = request.user

    if not user.is_authenticated:
        return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    
    search = request.GET.get('search', '').lower()

    pokemons = user.owned_pokemon.all()
    base_data = PokemonSerializer(pokemons, many=True).data
    enriched = []

    for p in base_data:
        api_data = fetch_pokeapi_data(p['poke_dex_id'])
        if search and api_data:
            if search not in api_data['name'].lower():
                continue
        p['api_data'] = api_data or {}
        enriched.append(p)

    return Response(enriched, status=status.HTTP_200_OK)