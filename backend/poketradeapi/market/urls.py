from django.urls import path
from . import views 

urlpatterns = [
            path("user_balance/", views.user_balance,name = "user_balance"),

            path('admin/listings/', views.get_all_listings),
            path('admin/listings/<int:listing_id>/update/', views.update_listing),
            path('admin/listings/<int:listing_id>/delete/', views.delete_listing),
            path('admin/listings/create/', views.create_listing),
        ]