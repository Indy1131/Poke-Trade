from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from poketradeapi.utils import admin_required
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from pokemon.utils import assign_random_pokemon_to_user
from pokemon.serializers import PokemonSerializer
from market.models import Bids, Asks
from market.serializers import BidsSerializer, AsksSerializer
# Create your views here.

@api_view(['GET'])
def get_user(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status= status.HTTP_200_OK)
    except(User.DoesNotExist):
        return Response({'detail':'user not found'}, status = status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
def create_user(request):
    try:
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Only save non-sensitive fields

            # Set password manually
            password = request.data.get('password')
            if password:
                user.set_password(password)
                user.save()
            
            assign_random_pokemon_to_user(user)

            return Response({'detail': 'User created successfully'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_user(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"detail": "Logout successful."}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"detail": "Invalid token."}, status=status.HTTP_400_BAD_REQUEST)
    
class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Grab tokens from response data
        access_token = response.data.get("access")
        refresh_token = response.data.get("refresh")

        # Remove tokens from body if you want to be strict about cookie-only
        # del response.data["access"]
        # del response.data["refresh"]

        if access_token and refresh_token:
            # Set cookies
            response.set_cookie(
                key='access',
                value=access_token,
                httponly=True,
                secure=False,           # True in production (requires HTTPS)
                samesite='Lax',       # Needed for cross-site cookies
                max_age=3600,
                path='/'
            )
            response.set_cookie(
                key='refresh',
                value=refresh_token,
                httponly=True,
                secure=False,
                samesite='Lax',
                max_age=7 * 24 * 60 * 60,
                path='/'
            )

        return response

@api_view(['GET'])
@admin_required
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@admin_required
def update_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)
    return Response(serializer.errors, status=400)
    
@api_view(['DELETE'])
@admin_required
def delete_user(request, user_id):
    user = get_object_or_404(User, id=user_id)
    user.delete()
    return Response(status=204)

@api_view(['GET'])
@admin_required
def admin_user_collection(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        pokemons = user.owned_pokemon.all()
        serializer = PokemonSerializer(pokemons, many=True)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)

@api_view(['GET'])
@admin_required
def admin_user_transactions(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        bids = Bids.objects.filter(bidder=user)
        asks = Asks.objects.filter(asker=user)

        bid_data = BidsSerializer(bids, many=True).data
        ask_data = AsksSerializer(asks, many=True).data

        return Response({'bids': bid_data, 'asks': ask_data})
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)