from django.urls import path
from . import views
from .views import purchase_pokemon

urlpatterns = [
    path('create/', views.create_trade_request, name='create-trade'),
    path('my-trades/', views.get_user_trades, name='my-trades'),
    path('purchase/<int:listing_id>/', purchase_pokemon, name='purchase-pokemon'),
    path('offers/', views.get_offers, name='get-offers'),           # getOffers()
    path('outbound/', views.get_outbound_trades, name='get-outbound'),  # getOutbound()
    path('accept/<int:trade_id>/', views.accept_offer, name='accept-offer'),
    path('reject/<int:trade_id>/', views.reject_trade, name='reject-trade'),
    path('transactions/', views.get_transactions, name='get-transactions'),
]
