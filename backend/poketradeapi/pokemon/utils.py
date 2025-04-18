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
    # PokeAPICache.objects.all().delete()
    # Try cache first
    try:
        cache = PokeAPICache.objects.get(poke_dex_id=poke_dex_id)
        return {
            'name': cache.name,
            'stats': cache.stats,
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

            stats = {"HP": data['stats'][0]['base_stat'], 
                     "Attack": data['stats'][1]['base_stat'],
                     "Defense": data['stats'][2]['base_stat'], 
                     "Sp. Atk": data['stats'][3]['base_stat'],
                     "Sp. Def": data['stats'][4]['base_stat'], 
                     "Speed": data['stats'][5]['base_stat']}

            name = data['name']
            types = [t['type']['name'] for t in data['types']]
            sprite = data['sprites']['front_default']

            # Save to cache
            PokeAPICache.objects.get_or_create(
                poke_dex_id=poke_dex_id,
                name=name,
                stats=stats,
                types=types,
                sprite=sprite
            )

            return {
                'name': name,
                'stats': stats,
                'types': types,
                'sprite': sprite
            }
    except Exception as e:
        print(e)
        pass

    return None
    