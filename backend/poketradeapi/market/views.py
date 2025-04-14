from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Balance
from .serializers import BalanceSerializer

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
    
