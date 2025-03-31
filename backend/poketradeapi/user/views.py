from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer

# Create your views here.

@api_view(['GET'])
def get_user(request, user_id):
    try:
        user = User.objects.get(pk=user_id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status= status.HTTP_200_OK)
    except(User.DoesNotExist):
        return Response({'detail':'user not found'}, status = status.HTTP_404_NOT_FOUND)



