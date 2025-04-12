from django.db import models
from django.conf import settings

class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="profile")
    balance = models.PositiveIntegerField(default=5000)  # Start with 5000 PD

    def __str__(self):
        return f"{self.user.username} - {self.balance} PD"
# Create your models here.
