from django.urls import path
from . import views

urlpatterns = [
    path('', views.barter_public, name='barter_public'),  # Открытая страница с описанием
    path('dashboard/', views.barter_dashboard, name='barter_dashboard'),  # Личный кабинет
    path('requests/', views.barter_requests, name='barter_requests'),  # Таблица заявок
]
