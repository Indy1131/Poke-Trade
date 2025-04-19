from django.db import models
from django.contrib.auth.models import User
from pokemon.models import Pokemon
# Create your models here.

class Balance(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name="balance")
    balance = models.PositiveIntegerField(default = 5000)

class Bids(models.Model):
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('FILLED', 'Filled'),
    ]
    id = models.AutoField(primary_key=True)
    bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'bids')
    poke_dex_id = models.IntegerField()
    amount = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length = 10, choices = STATUS_CHOICES, default = 'OPEN')

class Asks(models.Model):
    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('FILLED', 'Filled'),
    ]
    id = models.AutoField(primary_key=True)
    asker = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'asks')
    poke_dex_id = models.IntegerField()
    amount = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length = 10, choices = STATUS_CHOICES, default = 'OPEN')

class ListingContent(models.Model):
    pokemon = models.ManyToManyField(Pokemon, blank = True)
    currency = models.PositiveIntegerField(null = True, blank = True)

# class Listing(models.Model):
#     STATUS_CHOICES = [
#         ('OPEN', 'Open'),
#         ('CLOSED', 'Closed'),
#     ]
#     id = models.AutoField(primary_key=True)
#     owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'trade_listings')
#     offer = models.OneToOneField(ListingContent, on_delete = models.CASCADE, related_name = 'offered_in')
#     ask = models.OneToOneField(ListingContent, on_delete = models.CASCADE, related_name = 'asked_in')
#     created_at = models.DateTimeField(auto_now_add=True)
#     status = models.CharField(max_length = 10, choices = STATUS_CHOICES, default = 'OPEN')

