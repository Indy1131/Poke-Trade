from django.urls import path
from . import views 

urlpatterns = [
            path('<int:pokemon_id>/', views.get_pokemon, name = 'get_pokemon'),
]