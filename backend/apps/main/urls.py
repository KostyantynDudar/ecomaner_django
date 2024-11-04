# main/urls.py
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('home/', views.HomeView.as_view(), name='home'),  # API для главной страницы
    # Добавьте маршруты для других API-эндпоинтов, например, для "about", "how-it-works", и т.д.
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),   # Для JWT-токенов (авторизация)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Обновление JWT-токена
]
