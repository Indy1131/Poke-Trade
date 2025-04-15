from django.urls import path
from . import views 

urlpatterns = [
            path('<int:pokemon_id>/', views.get_pokemon, name = 'get_pokemon'),
            path('create/', views.create_pokemon, name = 'create_pokemon'),
            path('user_pokemon/', views.get_user_pokemon, name='get_user_pokemon'),

            path('admin/all/', views.get_all_pokemon, name = 'get_all_pokemon'),
            path('admin/<int:pokemon_id>/update/', views.update_pokemon, name = 'update_pokemon'),
            path('admin/<int:pokemon_id>/delete/', views.delete_pokemon, name = 'delete_pokemon'),
            ]