from django.urls import path
from . import views
from .views import PhotoLocationsView  # Убедитесь, что этот импорт присутствует

urlpatterns = [
    path('example/', views.ExampleView.as_view(), name='example'),
    path('photo-locations/', PhotoLocationsView.as_view(), name='photo_locations'),
]
