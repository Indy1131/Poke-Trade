from django.urls import path
from . import views 

urlpatterns = [
            path('<int:pokemon_id>/', views.get_pokemon, name = 'get_pokemon'),
            path('user/collection/', user_pokemon_collection, name='user_pokemon_collection'),
]