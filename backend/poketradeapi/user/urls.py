from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import CookieTokenObtainPairView

urlpatterns =[
            path('<int:user_id>/',views.get_user,name = 'get_user'),
            path('create/', views.create_user, name = 'create_user'),
            path('login/', CookieTokenObtainPairView.as_view(), name = 'token_obtain_pair'),
            path('refresh_token/', TokenRefreshView.as_view(), name = 'token_refresh'),
            path('logout/', views.logout_user, name='logout_user'),

            path('admin/all/', views.get_all_users, name = 'get_all_users'),  
            path('admin/<int:user_id>/update/', views.update_user, name = 'update_user'),
            path('admin/<int:user_id>/delete/', views.delete_user, name = 'delete_user'),
            path('admin/<int:user_id>/collection/', views.admin_user_collection, name = 'admin_user_collection'),
            path('admin/<int:user_id>/transactions/', views.admin_user_transactions, name = 'admin_user_transactions'),
            ]