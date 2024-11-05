# apps/main/views.py
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

# Простейший HTML-рендеринг
def home(request):
    return render(request, 'home.html')  # Убедитесь, что шаблон 'home.html' существует в папке templates

# Пример API-представления
class HomeView(APIView):
    def get(self, request):
        data = {"message": "Welcome to Ecomaner!"}
        return Response(data)
