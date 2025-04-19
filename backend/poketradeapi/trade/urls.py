from django.urls import path
from . import views

urlpatterns = [
    path("create/", views.create_trade_request, name="create-trade"),
    path("", views.get_user_trades, name="my-trades"),
    path("cancel/<int:trade_id>/", views.cancel_trade, name="cancel-trade"),
    path("accept/<int:trade_id>/", views.accept_trade, name="accept-offer"),
    path("transactions/", views.get_transactions, name="get-transactions"),
    path("listings/", views.get_listings, name="get-listings"),
    path("create_listing/", views.create_listing, name="create-listing"),
    path("listings/<int:listing_id>/", views.get_listing, name="get-listing"),
    path("listings/<int:listing_id>/edit/", views.edit_listing, name="edit-listing"),
    path("listings/<int:listing_id>/delete/", views.delete_listing, name="delete-listing"),
    path("listings/<int:listing_id>/purchase/", views.purchase_listing, name="purchase-listing"),
]
