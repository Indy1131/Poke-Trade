from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Trade
from .serializers import TradeSerializer
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
def get_incoming_requests(request):
    trades = Trade.objects.filter(recipient=request.user, status='pending')
    serializer = TradeSerializer(trades, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_trade_status(request, trade_id):
    try:
        trade = Trade.objects.get(id=trade_id, recipient=request.user)
    except Trade.DoesNotExist:
        return Response({'detail': 'Trade not found or unauthorized'}, status=status.HTTP_404_NOT_FOUND)

    status_choice = request.data.get('status')
    if status_choice not in ['approved', 'rejected']:
        return Response({'detail': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    if trade.status != 'pending':
        return Response({'detail': 'Trade already resolved'}, status=status.HTTP_400_BAD_REQUEST)

    # Update status
    trade.status = status_choice
    trade.save()

    # Transfer logic for approval
    if status_choice == 'approved':
        if trade.trade_type == 'purchase':
            # Transfer ownership of the requested Pokemon to the requester
            trade.pokemon_requested.owner_user = trade.requester
            trade.pokemon_requested.save()
        elif trade.trade_type == 'trade':
            # Swap ownership of both Pokémon
            offered = trade.pokemon_offered
            requested = trade.pokemon_requested

            # Swap owners
            offered_owner = offered.owner_user
            offered.owner_user = requested.owner_user
            requested.owner_user = offered_owner

            offered.save()
            requested.save()

        trade.status = 'completed'
        trade.save()

    return Response({'detail': f'Trade {status_choice} successfully.'}, status=status.HTTP_200_OK)
