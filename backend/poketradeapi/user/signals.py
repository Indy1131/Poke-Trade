from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from pokemon.models import Pokemon
import random

# List of Pokédex IDs (Example: First 151 Pokémon from Gen 1)
POKEDEX_IDS = list(range(1, 152))  # Adjust based on available Pokémon

@receiver(post_save, sender=User)
def give_starter_pokemon(sender, instance, created, **kwargs):
    if created:  # Only when a new user is created
        random_pokemon_ids = random.sample(POKEDEX_IDS, 3)  # Get 3 random Pokémon
        for poke_id in random_pokemon_ids:
            Pokemon.objects.create(owner_user=instance, poke_dex_id=poke_id)
