from django.urls import path
from . import views

urlpatterns = [
    path('trade/send/<int:receiver_id>/<int:offered_pokemon_id>/<int:requested_pokemon_id>/', views.send_trade_request, name='send_trade'),
    path('trade/accept/<int:trade_request_id>/', views.accept_trade, name='accept_trade'),
]
