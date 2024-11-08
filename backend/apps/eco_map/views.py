# eco_map/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Location
from .serializers import LocationSerializer

# /home/ecomaner_django/backend/apps/eco_map/views.py
from rest_framework import viewsets
from .models import Location
from .serializers import LocationSerializer

class LocationViewSet(viewsets.ModelViewSet):
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
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

# /home/ecomaner_django/backend/apps/eco_map/views.py
from django.http import JsonResponse

def test_view(request):
    return JsonResponse({"status": "success", "message": "Basic route works"})

# /home/ecomaner_django/backend/apps/eco_map/views.py
from django.http import JsonResponse

def another_test_view(request):
    return JsonResponse({"status": "success", "message": "Another test route works"})
