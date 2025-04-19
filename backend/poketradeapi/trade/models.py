from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from pokemon.models import Pokemon

class Trade(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='original_owner')
    offerer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='offer_owner')
    original = models.ForeignKey(Pokemon, on_delete=models.CASCADE, related_name='original')
    offer = models.ForeignKey(Pokemon, on_delete=models.CASCADE, related_name='offer')
    completed = models.BooleanField(default=False)

class Listing(models.Model):
    pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE)
    price = models.PositiveIntegerField()
    completed = models.BooleanField(default=False)

class Transaction(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transaction_buyer')
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transaction_seller')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    info = GenericForeignKey('content_type', 'object_id')
    created_at = models.DateTimeField(auto_now_add=True)
