from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from .models import BarterRequest, BarterDeal, UserBalance
from .serializers import BarterRequestSerializer, BarterDealSerializer
from .permissions import IsOwnerOrReadOnly
import logging

logger = logging.getLogger(__name__)

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

# 🔹 Ограничение запросов (anti-spam)
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
        logger.debug(f"📌 Данные перед сохранением: {self.request.data}")  # ✅ Добавляем логирование
        serializer.save(
            owner=self.request.user,
            location=self.request.data.get('address', ''),  # ✅ Правильное сохранение
            estimated_value=self.request.data.get('value', 0)  # ✅ Правильное сохранение
        )

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

# 🔹 API для создания сделки
class CreateDealAPIView(generics.CreateAPIView):
    """Создание сделки между пользователями"""
    serializer_class = BarterDealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        try:
            item_A_id = self.request.data.get("item_A")
            item_B_id = self.request.data.get("item_B")

            logger.info(f"📌 Создание сделки: item_A={item_A_id}, item_B={item_B_id}")

            if not item_A_id or not str(item_A_id).isdigit():
                raise serializers.ValidationError("Некорректный item_A")

            item_A = get_object_or_404(BarterRequest, id=int(item_A_id))

            item_B = None
            if item_B_id:
                if not str(item_B_id).isdigit():
                    raise serializers.ValidationError("Некорректный item_B")
                item_B = get_object_or_404(BarterRequest, id=int(item_B_id))

            compensation = float(self.request.data.get("compensation_points", 0))

            # Проверяем баланс инициатора сделки
            initiator_balance, _ = UserBalance.objects.get_or_create(user=self.request.user)
            if compensation > initiator_balance.balance:
                raise serializers.ValidationError("Недостаточно баллов для компенсации!")

            serializer.save(initiator=self.request.user, item_A=item_A, item_B=item_B)

        except ValueError:
            raise serializers.ValidationError("Ошибка обработки данных сделки")



# 🔹 API для подтверждения сделки
class ConfirmDealAPIView(generics.UpdateAPIView):
    """Подтверждение сделки второй стороной"""
    queryset = BarterDeal.objects.all()
    serializer_class = BarterDealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        instance = serializer.instance

        if instance.partner is not None:
            raise serializers.ValidationError("Сделка уже подтверждена другим пользователем.")

        if instance.status != 'pending':
            raise serializers.ValidationError("Сделка уже в процессе или завершена.")

        if instance.initiator == self.request.user:
            raise serializers.ValidationError("Вы не можете подтвердить свою же сделку.")

        instance.partner = self.request.user
        instance.status = 'active'

        # Переводим компенсацию баллов между пользователями
        if instance.compensation_points > 0:
            initiator_balance = get_object_or_404(UserBalance, user=instance.initiator)
            partner_balance = get_object_or_404(UserBalance, user=self.request.user)

            try:
                initiator_balance.remove_points(instance.compensation_points)
                partner_balance.add_points(instance.compensation_points)
            except ValueError:
                raise serializers.ValidationError("Недостаточно баллов у инициатора сделки.")

        instance.save()
        logger.info(f"Сделка {instance.id} подтверждена пользователем {self.request.user.username}")

# 🔹 API для получения списка сделок пользователя
class UserDealsAPIView(generics.ListAPIView):
    """Получение списка сделок пользователя"""
    serializer_class = BarterDealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BarterDeal.objects.filter(initiator=self.request.user) | BarterDeal.objects.filter(partner=self.request.user)
