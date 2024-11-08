# eco_map/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Location
from .serializers import LocationSerializer

class LocationListAPIView(APIView):
    """
    API для получения списка точек на карте.
    """
    def get(self, request):
        locations = Location.objects.all()
        serializer = LocationSerializer(locations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# /home/ecomaner_django/backend/apps/eco_map/views.py
from django.http import JsonResponse

def test_view(request):
    return JsonResponse({"status": "success", "message": "Basic route works"})

# /home/ecomaner_django/backend/apps/eco_map/views.py
from django.http import JsonResponse

def another_test_view(request):
    return JsonResponse({"status": "success", "message": "Another test route works"})
