# /home/ecomaner_django/backend/apps/eco_map/urls.py
from django.urls import path
from .views import LocationListAPIView

urlpatterns = [
    path('locations/', LocationListAPIView.as_view(), name='location-list'),
]
