from django.db import models
from django.contrib.auth.models import User
from pokemon.models import Pokemon


class Trade(models.Model):
    TRADE_STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('completed', 'Completed'),
    ]

    TRADE_TYPE = [
        ('purchase', 'Purchase'),
        ('trade', 'Trade'),
    ]

    id = models.AutoField(primary_key=True)
    requester = models.ForeignKey(User, on_delete=models.CASCADE,
                                  related_name='trade_requests'
                                  )  # who is initiating the request
    recipient = models.ForeignKey(User, on_delete=models.CASCADE,
                                  related_name='received_trades')  # who owns the Pokemon

    pokemon_offered = models.ForeignKey(
        Pokemon,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='offered_in_trades'
    )  # for trade

    pokemon_requested = models.ForeignKey(
        Pokemon,
        on_delete=models.CASCADE,
        related_name='requested_in_trades',
        null=False,

    )  # target Pokemon

    trade_type = models.CharField(max_length=10, choices=TRADE_TYPE)
    status = models.CharField(max_length=10, choices=TRADE_STATUS, default='pending')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
