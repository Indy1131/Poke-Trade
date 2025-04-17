from django.contrib.auth.models import User
from rest_framework import serializers
from market.models import Balance

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True) 
    balance = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id','username','email','password','balance']

    def get_balance(self, user):
        balance_obj, created = Balance.objects.get_or_create(user=user, defaults={'balance': 5000})
        return balance_obj.balance