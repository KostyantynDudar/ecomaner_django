from django.urls import path
from . import views



urlpatterns = [

	path('main/home/', views.main_home, name='main_home'),  # маршрут для эндпоинта


]
