import random
from .models import Pokemon
import requests
from .models import PokeAPICache

def assign_random_pokemon_to_user(user, count=3):
    pokedex_ids = random.sample(range(1, 152), count)  # e.g., Gen 1
    created = []
    for pid in pokedex_ids:
        pokemon = Pokemon.objects.create(owner_user=user, poke_dex_id=pid)
        created.append(pokemon)
    return created

def fetch_pokeapi_data(poke_dex_id):
    # Try cache first
    try:
        cache = PokeAPICache.objects.get(poke_dex_id=poke_dex_id)
        return {
            'name': cache.name,
            'types': cache.types,
            'sprite': cache.sprite
        }
    except PokeAPICache.DoesNotExist:
        pass

    # If not cached, fetch from API
    try:
        res = requests.get(f"https://pokeapi.co/api/v2/pokemon/{poke_dex_id}")
        if res.status_code == 200:
            data = res.json()
            name = data['name']
            types = [t['type']['name'] for t in data['types']]
            sprite = data['sprites']['front_default']

            # Save to cache
            PokeAPICache.objects.create(
                poke_dex_id=poke_dex_id,
                name=name,
                types=types,
                sprite=sprite
            )

            return {
                'name': name,
                'types': types,
                'sprite': sprite
            }
    except:
        pass

    return None
    