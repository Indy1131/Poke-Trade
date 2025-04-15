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
                ]