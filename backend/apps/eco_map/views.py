# eco_map/views.py

import logging

logger = logging.getLogger(__name__)

from rest_framework.exceptions import PermissionDenied
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from .models import Location
from django.core.files.storage import default_storage
from django.views.decorators.csrf import csrf_exempt
from .serializers import LocationSerializer

from rest_framework.permissions import IsAuthenticated

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]  # Требуем аутентификацию

    def perform_create(self, serializer):
        # Логируем токен
        logger.debug(f"Заголовки запроса: {self.request.headers}")
        logger.debug(f"Пользователь: {self.request.user}")
        
        if self.request.user.is_anonymous:
            raise PermissionDenied("Пользователь должен быть аутентифицирован!")
        
        location = serializer.save(created_by=self.request.user)
        
        # Получаем и сохраняем адрес
        if not location.address:
            location.address = location.fetch_address_from_nominatim()
            location.save()

"""
    API для управления локациями на карте.
    Поддерживает следующие операции:
    - GET /api/locations/ — получить список всех локаций
    - POST /api/locations/ — создать новую локацию
    - GET /api/locations/<id>/ — получить данные конкретной локации
    - PUT /api/locations/<id>/ — обновить данные локации
    - PATCH /api/locations/<id>/ — частичное обновление
    - DELETE /api/locations/<id>/ — удалить локацию

    Примеры использования:
    1. Создание новой локации:
       POST запрос с телом:
       {
           "latitude": 55.751244,
           "longitude": 37.618423,
           "description": "Новая свалка",
           "type": "waste_dump",
           "status": "active"
       }

    2. Удаление локации:
       DELETE запрос на /api/locations/<id>/
       
    3. Изменение статуса локации:
       PATCH запрос с телом:
       {
           "status": "cleaned"
       }

    4. Добавление пользователя к локации (в разработке):
       Поддержка для назначения авторов и участников.
"""

def test_view(request):
    """
    Тестовая функция для проверки базового маршрута.
    """
    return JsonResponse({"status": "success", "message": "Basic route works"})


def another_test_view(request):
    """
    Еще одна тестовая функция для проверки другого маршрута.
    """
    return JsonResponse({"status": "success", "message": "Another test route works"})
