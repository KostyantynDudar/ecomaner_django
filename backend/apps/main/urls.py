# apps/main/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),             # Главная HTML-страница (home)
    path('api/home/', views.HomeView.as_view(), name='api-home'),  # API endpoint
]
