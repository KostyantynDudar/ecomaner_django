# backend/apps/eco_map/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LocationViewSet

# Роутер DRF для CRUD операций с локациями
router = DefaultRouter()
router.register(r'locations', LocationViewSet, basename='location')

# Подключаем маршруты, сгенерированные роутером
urlpatterns = [
    path('', include(router.urls)),
]
