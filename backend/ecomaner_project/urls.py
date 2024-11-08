"""
URL configuration for ecomaner project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


# ecomaner_project/urls.py
from django.contrib import admin
from django.urls import path, include
from apps.eco_map.views import test_view, another_test_view  # Импортируем тестовое представление


urlpatterns = [

    path('admin/', admin.site.urls),
    path('news/', include('apps.news.urls')),  # Это для News API
    path('api/main/', include('apps.main.urls')),  # Это для Main API
    path('api/', include('apps.eco_map.urls')),  # Подключение API для карты
    path('test/', test_view),  # Подключаем тестовый маршрут напрямую
    path('test-direct/', test_view),  # Новый тестовый маршрут
]
