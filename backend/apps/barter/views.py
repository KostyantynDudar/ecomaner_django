# backend/apps/barter/views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework import generics, permissions
from rest_framework.throttling import UserRateThrottle
from .models import BarterRequest
from .serializers import BarterRequestSerializer
from .permissions import IsOwnerOrReadOnly  # Импортируем кастомное правило

def barter_public(request):
    """Публичная страница платформы бартера."""
    return render(request, 'barter/public.html')

@login_required
def barter_dashboard(request):
    """Личный кабинет бартера."""
    return render(request, 'barter/dashboard.html')

@login_required
def barter_requests(request):
    """Таблица заявок на бартер."""
    return render(request, 'barter/requests.html')

class BarterRequestThrottle(UserRateThrottle):
    """Ограничение количества запросов (анти-спам)."""
    rate = '1000/day'  # Максимум 1000 запросов в день

class UserBarterRequestsAPIView(generics.ListCreateAPIView):
    """API для получения и создания заявок пользователя"""
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.IsAuthenticated]  # Только для авторизованных
    throttle_classes = [BarterRequestThrottle]  # Ограничение запросов

    def get_queryset(self):
        """Показываем пользователю только его заявки."""
        print(f"✅ API вызван, пользователь: {self.request.user}")
        return BarterRequest.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """При создании заявки автоматически назначаем владельца."""
        serializer.save(owner=self.request.user)

class UserBarterRequestDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """API для просмотра, редактирования и удаления заявки"""
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]  # Только владелец может менять

    def get_queryset(self):
        """Позволяем редактировать только свои заявки."""
        return BarterRequest.objects.filter(owner=self.request.user)

class UserBarterDealsAPIView(generics.ListAPIView):
    """API для получения списка обменов пользователя"""
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.IsAuthenticated]  # Только для авторизованных

    def get_queryset(self):
        """Показываем пользователю только его обмены (где он либо владелец, либо обмен происходит с ним)"""
        return BarterRequest.objects.filter(owner=self.request.user)

class AllBarterRequestsAPIView(generics.ListAPIView):
    """API для получения всех заявок на бартер"""
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.AllowAny]  # Доступен всем

    def get_queryset(self):
        """Возвращает все заявки на бартер"""
        return BarterRequest.objects.all()
