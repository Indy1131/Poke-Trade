from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_trade_request, name='create-trade'),
    path('my-trades/', views.get_user_trades, name='my-trades'),
    path('incoming/', views.get_incoming_requests, name='incoming-trades'),
    path('update-status/<int:trade_id>/', views.update_trade_status, name='update-trade-status'),
]
