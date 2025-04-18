from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import models
from .models import Trade
from .serializers import TradeSerializer
from market.models import Listing, Balance
from .models import Purchase, Transaction
from pokemon.models import Pokemon

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_trade_request(request):
    data = request.data.copy()
    data['requester'] = request.user.id  # auto-assign requester

    serializer = TradeSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({'detail': 'Trade request submitted'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_trades(request):
    trades = Trade.objects.filter(requester=request.user)
    serializer = TradeSerializer(trades, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_offers(request):
    trades = Trade.objects.filter(recipient=request.user, status='pending')
    serializer = TradeSerializer(trades, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_outbound_trades(request):
    trades = Trade.objects.filter(
        requester=request.user,
        status='pending'
    )
    serializer = TradeSerializer(trades, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def reject_trade(request, trade_id):
    try:
        trade = Trade.objects.get(id=trade_id)
    except Trade.DoesNotExist:
        return Response({'detail': 'Trade not found'}, status=status.HTTP_404_NOT_FOUND)

    if trade.pokemon_requested.owner_user != request.user and trade.requester != request.user:
        return Response({'detail': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

    trade.delete()
    return Response({'detail': 'Trade deleted'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_offer(request, trade_id):
    try:
        trade = Trade.objects.get(id=trade_id)
    except Trade.DoesNotExist:
        return Response({'detail': 'Trade not found'}, status=status.HTTP_404_NOT_FOUND)

    if trade.status != 'pending':
        return Response({'detail': 'Trade already resolved'}, status=status.HTTP_400_BAD_REQUEST)

    # Authorization check: only owner of requested Pokemon can accept
    if trade.pokemon_requested.owner_user != request.user:
        return Response({'detail': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

    # Swap ownership
    offered = trade.pokemon_offered
    requested = trade.pokemon_requested

    offered_owner = offered.owner_user
    requested_owner = requested.owner_user

    offered.owner_user = requested_owner
    requested.owner_user = offered_owner

    offered.save()
    requested.save()

    # Complete the trade
    trade.status = 'completed'
    trade.save()

    # Create transaction
    Transaction.objects.create(
        buyer=trade.requester,  # the person who initiated the trade
        seller=trade.recipient,  # the owner of the requested Pokémon
        trade=trade
    )

    return Response({'detail': 'Trade completed and transaction recorded'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def purchase_pokemon(request, listing_id):
    try:
        listing = Listing.objects.get(id=listing_id, status='OPEN')
    except Listing.DoesNotExist:
        return Response({'detail': 'Listing not found or already closed'}, status=status.HTTP_404_NOT_FOUND)

    buyer = request.user
    seller = listing.owner
    price = listing.ask.currency
    pokemon_qs = listing.offer.pokemon.all()

    if pokemon_qs.count() != 1:
        return Response({'detail': 'Invalid listing. Only one Pokémon should be listed per purchase.'}, status=status.HTTP_400_BAD_REQUEST)

    pokemon = pokemon_qs.first()

    # Check buyer has enough balance
    try:
        buyer_balance = buyer.balance
    except Balance.DoesNotExist:
        return Response({'detail': 'Buyer balance not found'}, status=status.HTTP_404_NOT_FOUND)

    if buyer_balance.balance < price:
        return Response({'detail': 'Insufficient funds'}, status=status.HTTP_400_BAD_REQUEST)

    # Deduct from buyer, add to seller
    seller_balance, _ = Balance.objects.get_or_create(user=seller)

    buyer_balance.balance -= price
    seller_balance.balance += price

    buyer_balance.save()
    seller_balance.save()

    # Transfer Pokémon ownership
    pokemon.owner_user = buyer
    pokemon.save()

    # Close listing
    listing.status = 'CLOSED'
    listing.save()

    # Record purchase
    Purchase.objects.create(buyer=buyer, seller=seller, pokemon=pokemon, price=price)

    return Response({'detail': 'Purchase successful'}, status=status.HTTP_200_OK)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transactions(request):
    transactions = Transaction.objects.filter(
        models.Q(buyer=request.user) | models.Q(seller=request.user)
    ).order_by('-created_at')

    data = [
        {
            'id': tx.id,
            'buyer': tx.buyer.username,
            'seller': tx.seller.username,
            'type': 'trade' if tx.trade else 'purchase',
            'ref_id': tx.trade.id if tx.trade else tx.purchase.id,
            'timestamp': tx.created_at
        }
        for tx in transactions
    ]

    return Response(data, status=status.HTTP_200_OK)

