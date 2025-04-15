from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from poketradeapi.utils import admin_required
from .models import Balance
from .serializers import BalanceSerializer
from market.models import Listing, Pokemon, ListingContent
from market.serializers import ListingSerializer, ListingContentSerializer
@api_view(['GET', 'PATCH'])
#@permission_classes([IsAuthenticated])
def user_balance(request):
    try:
        balance = request.user.balance
    except Balance.DoesNotExist:
        return Response({'error': 'Balance not found.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = BalanceSerializer(balance)
        return Response(serializer.data)

    elif request.method == 'PATCH':
        serializer = BalanceSerializer(balance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@admin_required
def get_all_listings(request):
    listings = Listing.objects.all()
    serializer = ListingSerializer(listings, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@admin_required
def create_listing(request):
    try:
        offer = ListingContent.objects.create()
        ask = ListingContent.objects.create()
        
        for pid in request.data.get('offer_pokemon_ids', []):
            offer.pokemon.add(Pokemon.objects.get(id=pid))
        for pid in request.data.get('ask_pokemon_ids', []):
            ask.pokemon.add(Pokemon.objects.get(id=pid))

        offer.currency = request.data.get('offer_currency', None)
        ask.currency = request.data.get('ask_currency', None)
        offer.save()
        ask.save()

        listing = Listing.objects.create(
            owner_id=request.data['owner_id'],
            offer=offer,
            ask=ask
        )

        return Response({'detail': 'Listing created', 'listing_id': listing.id})
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['PUT'])
@admin_required
def update_listing(request, listing_id):
    try:
        listing = Listing.objects.get(pk=listing_id)
        data = request.data

        # Update status
        if 'status' in data:
            listing.status = data['status']

        # Update offer content
        if 'offer_pokemon_ids' in data or 'offer_currency' in data:
            listing.offer.pokemon.set(Pokemon.objects.filter(id__in=data.get('offer_pokemon_ids', [])))
            listing.offer.currency = data.get('offer_currency')
            listing.offer.save()

        # Update ask content
        if 'ask_pokemon_ids' in data or 'ask_currency' in data:
            listing.ask.pokemon.set(Pokemon.objects.filter(id__in=data.get('ask_pokemon_ids', [])))
            listing.ask.currency = data.get('ask_currency')
            listing.ask.save()

        listing.save()
        return Response({'detail': 'Listing updated'}, status=200)

    except Listing.DoesNotExist:
        return Response({'detail': 'Listing not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['DELETE'])
@admin_required
def delete_listing(request, listing_id):
    try:
        listing = Listing.objects.get(pk=listing_id)
        listing.offer.delete()
        listing.ask.delete()
        listing.delete()
        return Response({'detail': 'Listing deleted'}, status=200)
    except Listing.DoesNotExist:
        return Response({'detail': 'Listing not found'}, status=404)
