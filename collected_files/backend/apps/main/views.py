# apps/main/views.py

from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Простейший HTML-рендеринг
def home(request):
    """
    Представление для HTML-страницы главной страницы.
    """
    return render(request, 'home.html')  # Убедитесь, что шаблон 'home.html' существует в папке templates

# Пример API-представления с ограничением доступа
class HomeView(APIView):
    """
    API-представление главной страницы, доступно только для авторизованных пользователей.
    """
    permission_classes = [IsAuthenticated]  # Только авторизованные пользователи

    def get(self, request):
        data = {"message": "Welcome to Ecomaner!"}
        return Response(data)
