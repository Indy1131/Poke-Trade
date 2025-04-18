from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Pokemon(models.Model):
    id = models.AutoField(primary_key=True)
    poke_dex_id = models.IntegerField()
    owner_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name = 'owned_pokemon')
    created_at = models.DateField(auto_now_add=True)

class PokeAPICache(models.Model):
    poke_dex_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=100)
    stats = models.JSONField()
    types = models.JSONField()
    sprite = models.URLField()
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name