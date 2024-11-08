# /home/ecomaner_django/backend/apps/eco_map/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LocationViewSet

router = DefaultRouter()
router.register(r'locations', LocationViewSet)  # Добавляем маршруты для CRUD

urlpatterns = [
    path('', include(router.urls)),
]
