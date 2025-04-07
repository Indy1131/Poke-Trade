from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from pokemon.models import Pokemon


# Create your models here.

class TradeRequest(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Rejected', 'Rejected'),
    ]

    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_trade_requests")
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_trade_requests")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Pending')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trade from {self.sender} to {self.receiver} - {self.status}"


class TradeDetail(models.Model):
    trade_request = models.ForeignKey(TradeRequest, on_delete=models.CASCADE, related_name="trade_details")
    offered_pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE, related_name="offered_in_trades")
    requested_pokemon = models.ForeignKey(Pokemon, on_delete=models.CASCADE, related_name="requested_in_trades")

    def __str__(self):
        return f"{self.offered_pokemon} ⇆ {self.requested_pokemon}"


class Trade(models.Model):
    initiator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="initiated_trades")
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="completed_trades")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trade between {self.initiator} and {self.recipient} on {self.timestamp}"