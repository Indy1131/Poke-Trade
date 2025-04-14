from django.urls import path
from . import views 

urlpatterns = [
            path('<int:pokemon_id>/', views.get_pokemon, name = 'get_pokemon'),
            path('create/', views.create_pokemon, name = 'create_pokemon'),
            path('user_pokemon/', views.get_user_pokemon, name='get_user_pokemon'),

]