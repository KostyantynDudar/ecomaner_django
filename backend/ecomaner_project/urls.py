"""
URL configuration for Ecomaner project.

The `urlpatterns` list routes URLs to views. 
For more information, see:
https://docs.djangoproject.com/en/5.1/topics/http/urls/

Examples:
Function views:
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')

Class-based views:
    1. Add an import: from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')

Including another URLconf:
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Основной конфигурационный файл URL
urlpatterns = [
    path('admin/', admin.site.urls),  # Админ-панель

    path('api/accounts/', include('apps.accounts.urls')),  # Аккаунты (авторизация/регистрация)

    path('api/locations/', include('apps.eco_map.urls')),  # Локации карты
    path('api/map/', include('apps.eco_map.urls')),  # Унифицированный путь для API карты

    path('api/news/', include('apps.news.urls')),  # Новости (доступ для всех)

    path('api/main/', include('apps.main.urls')),  # Информация о проекте

    path('barter/', include('apps.barter.urls')),  # Маршруты платформы бартера

    path('game/', include('game.urls')),  # Подключаем маршруты игры

]

# Подключаем раздачу медиафайлов в режиме отладки
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)