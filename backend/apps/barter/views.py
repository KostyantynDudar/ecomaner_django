# backend/apps/barter/views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework import generics, permissions
from rest_framework.throttling import UserRateThrottle
from .models import BarterRequest
from .serializers import BarterRequestSerializer
from .permissions import IsOwnerOrReadOnly  # Кастомное правило для прав доступа

# 🔹 Представления для рендеринга страниц
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

# 🔹 Ограничение запросов (анти-спам)
class BarterRequestThrottle(UserRateThrottle):
    """Ограничение количества запросов"""
    rate = '1000/day'  # Максимум 1000 запросов в день

# 🔹 API для создания и получения заявок пользователя
class UserBarterRequestsAPIView(generics.ListCreateAPIView):
    """API для получения и создания заявок пользователя"""
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [BarterRequestThrottle]

    def get_queryset(self):
        """Возвращает только заявки текущего пользователя"""
        return BarterRequest.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """При создании заявки автоматически назначаем владельца"""
        serializer.save(owner=self.request.user)

# 🔹 API для детального просмотра, обновления и удаления заявки
class UserBarterRequestDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """API для просмотра, редактирования и удаления заявки"""
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        """Возвращает только заявки, принадлежащие текущему пользователю"""
        return BarterRequest.objects.filter(owner=self.request.user)

# 🔹 API для списка всех обменов пользователя
class UserBarterDealsAPIView(generics.ListAPIView):
    """API для получения списка обменов пользователя"""
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Показывает пользователю только его обмены"""
        return BarterRequest.objects.filter(owner=self.request.user)

# 🔹 API для получения всех заявок (доступен всем)
class AllBarterRequestsAPIView(generics.ListAPIView):
    """API для просмотра всех заявок на бартер"""
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        """Возвращает все заявки на бартер"""
        return BarterRequest.objects.all()
