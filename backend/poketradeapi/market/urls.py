from django.urls import path
from . import views 

urlpatterns = [
            path("user_balance/", views.user_balance,name = "user_balance"),
]