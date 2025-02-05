# backend/apps/barter/views.py

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework import generics, permissions
from .models import BarterRequest
from .serializers import BarterRequestSerializer

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

class UserBarterRequestsAPIView(generics.ListCreateAPIView):
    """API для получения и создания заявок пользователя"""
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        print(f"✅ API вызван, пользователь: {self.request.user}")
        return BarterRequest.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
