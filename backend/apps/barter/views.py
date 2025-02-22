from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from rest_framework import generics, permissions, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.exceptions import PermissionDenied
from django.db.models import Q
from django.contrib.auth import get_user_model
import logging

from .models import BarterRequest, BarterDeal, UserBalance
from .serializers import BarterRequestSerializer, BarterDealSerializer

# ✅ Добавляем IsAuthenticated в permissions
from rest_framework.permissions import IsAuthenticated


logger = logging.getLogger(__name__)

# 🔹 Представления для рендеринга страниц
def barter_public(request):
    return render(request, 'barter/public.html')

@login_required
def barter_dashboard(request):
    return render(request, 'barter/dashboard.html')

@login_required
def barter_requests(request):
    return render(request, 'barter/requests.html')

# 🔹 Ограничение запросов
class BarterRequestThrottle(UserRateThrottle):
    rate = '1000/day'

# 🔹 API для получения списка заявок (ТОЛЬКО свои!)
class UserBarterRequestsAPIView(generics.ListCreateAPIView):
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BarterRequest.objects.filter(owner=self.request.user)  # ✅ Только свои заявки

    def perform_create(self, serializer):
        logger.debug(f"📌 Данные перед сохранением: {self.request.data}")
        serializer.save(
            owner=self.request.user,
            location=self.request.data.get('address', ''),
            estimated_value=self.request.data.get('value', 0),
            is_reserved=False
        )

# 🔹 API для получения конкретной заявки (ДОСТУП УЧАСТНИКАМ СДЕЛКИ)
class UserBarterRequestDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        # ✅ Исправленный запрос
        queryset = BarterRequest.objects.filter(
            Q(owner=user) |
            Q(id__in=BarterDeal.objects.filter(item_A_id__in=BarterRequest.objects.filter(owner=user).values_list("id", flat=True)).values_list("item_B_id", flat=True)) |
            Q(id__in=BarterDeal.objects.filter(item_B_id__in=BarterRequest.objects.filter(owner=user).values_list("id", flat=True)).values_list("item_A_id", flat=True))
        ).distinct()


        logger.debug(f"📌 Запрос на товар: {self.request.query_params}, Найденные ID: {[item.id for item in queryset]}")
        
        return queryset

# 🔹 API для получения баланса пользователя
class UserBalanceAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Возвращает текущий баланс и зарезервированные баллы пользователя"""
        user_balance, _ = UserBalance.objects.get_or_create(user=request.user)
        return Response({
            "balance": user_balance.balance,
            "reserved_balance": user_balance.reserved_balance  # ✅ Теперь возвращаем и резерв
        })


# 🔹 API для получения всех заявок
class AllBarterRequestsAPIView(generics.ListAPIView):
    serializer_class = BarterRequestSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return BarterRequest.objects.all()

from django.contrib.auth import get_user_model

User = get_user_model()  # ✅ Добавляем импорт

# 🔹 API для создания сделки

class CreateDealAPIView(generics.CreateAPIView):
    serializer_class = BarterDealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        logger.debug(f"📌 Данные перед созданием сделки: {self.request.data}")  # Логируем входящие данные

        # Получаем товары по ID из запроса
        item_A = get_object_or_404(BarterRequest, id=self.request.data.get("item_A"))
        item_B = get_object_or_404(BarterRequest, id=self.request.data.get("item_B")) if self.request.data.get("item_B") else None
        compensation = float(self.request.data.get("compensation_points", 0))

        # Проверяем, не участвует ли товар уже в другой сделке
        if item_A.is_reserved:
            raise serializers.ValidationError("Этот товар уже участвует в другой сделке!")
        if item_B and item_B.is_reserved:
            raise serializers.ValidationError("Товар B уже зарезервирован в другой сделке!")

        # Проверяем баланс пользователя
        initiator_balance, _ = UserBalance.objects.get_or_create(user=self.request.user)
        if compensation > initiator_balance.balance:
            raise serializers.ValidationError("Недостаточно баллов для компенсации!")

        # Определяем партнера сделки
        partner = None
        if item_B:
            partner = item_B.owner
        elif self.request.data.get("partner_email"):
            partner = get_object_or_404(User, email=self.request.data.get("partner_email"))

        if not partner:
            raise serializers.ValidationError("Невозможно создать сделку без партнера!")

        logger.debug(f"📌 Partner найден: {partner}")  # Логируем найденного партнера

        # Устанавливаем статус сделки
        status = "active" if partner else "pending"

        # Помечаем товары как зарезервированные
        item_A.is_reserved = True
        item_A.save()
        if item_B:
            item_B.is_reserved = True
            item_B.save()

        # Создаем сделку
        deal = serializer.save(
            initiator=self.request.user,
            partner=partner,
            item_A=item_A,
            item_B=item_B,
            status=status
        )

        logger.info(f"✅ Сделка {deal.id} создана: {self.request.user.email} ↔ {partner.email if partner else 'Ожидает партнера'}")

        # TODO: Если сделка активирована, отправить уведомление партнёру



# 🔹 API для просмотра деталей сделки
from rest_framework.exceptions import PermissionDenied

class DealDetailAPIView(generics.RetrieveAPIView):
    queryset = BarterDeal.objects.all()
    serializer_class = BarterDealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        deal = super().get_object()
        if deal.initiator != self.request.user and deal.partner != self.request.user:
            logger.warning(f"❌ Доступ запрещен: {self.request.user} пытался открыть сделку {deal.id}")
            raise PermissionDenied("Вы не участвуете в этой сделке.")
        return deal

# 🔹 API для подтверждения сделки
class ConfirmDealAPIView(generics.UpdateAPIView):
    """Подтверждение сделки. Если баллы равны — сделка начинается, если нет — идёт доплата."""
    queryset = BarterDeal.objects.all()
    serializer_class = BarterDealSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        deal = super().get_object()
        if self.request.user != deal.initiator and self.request.user != deal.partner:
            logger.warning(f"❌ Доступ запрещён: {self.request.user} пытался подтвердить сделку {deal.id}")
            raise PermissionDenied("Вы не участвуете в этой сделке.")
        return deal

    def update(self, request, *args, **kwargs):
        deal = self.get_object()

        # ❌ Если сделка уже началась, запретить повторное подтверждение
        if deal.status == "started":
            return Response({"error": "Сделка уже началась!"}, status=400)

        price_difference = abs(deal.item_A.estimated_value - deal.item_B.estimated_value)
        user_balance, _ = UserBalance.objects.get_or_create(user=request.user)

        # ✅ Сделка стартует, если стоимость равна
        if price_difference == 0:
            deal.status = "started"
            deal.save()
            return Response({"message": "Сделка началась!"}, status=200)

        # ✅ Если у пользователя хватает баллов, резервируем их и стартуем сделку
        if user_balance.balance >= price_difference:
            user_balance.balance -= price_difference
            user_balance.reserved_balance += price_difference  # 🔹 Резервируем сумму
            user_balance.save()

            deal.status = "started"
            deal.save()

            return Response({"message": "Сделка началась с доплатой!", "reserved": price_difference}, status=200)

        return Response({"error": "Недостаточно баллов для сделки!"}, status=400)



class CancelDealAPIView(APIView):
    """Отмена сделки (возможна на всех стадиях, кроме 'completed')"""
    permission_classes = [IsAuthenticated]

    def post(self, request, deal_id):
        logger.info(f"🔹 Запрос на отмену сделки: deal_id={deal_id}, user={request.user}")
        
        deal = get_object_or_404(BarterDeal, id=deal_id)
        user = request.user  # ✅ Исправлено: получаем пользователя напрямую

        logger.debug(f"📌 Найденная сделка: {deal}")
        logger.debug(f"📌 Статус сделки перед отменой: {deal.status}")

        if deal.status == "completed":
            logger.warning(f"❌ Попытка отменить завершенную сделку: deal_id={deal_id}")
            return Response({"error": "Сделка уже завершена и не может быть отменена."}, status=400)

        # Возвращаем зарезервированные баллы (если были)
        user_balance, _ = UserBalance.objects.get_or_create(user=user)
        logger.debug(f"📌 Баланс до возврата: {user_balance.balance}, зарезервировано: {user_balance.reserved_balance}")
        
        user_balance.balance += user_balance.reserved_balance
        user_balance.reserved_balance = 0
        user_balance.save()
        
        logger.debug(f"✅ Баланс после возврата: {user_balance.balance}")

        # Освобождаем товары
        if deal.item_A:
            deal.item_A.is_reserved = False
            deal.item_A.save()
            logger.debug(f"✅ Товар A {deal.item_A} освобожден")
        if deal.item_B:
            deal.item_B.is_reserved = False
            deal.item_B.save()
            logger.debug(f"✅ Товар B {deal.item_B} освобожден")

        # Меняем статус
        deal.status = "cancelled"
        deal.save()



        logger.info(f"✅ Сделка {deal_id} успешно отменена пользователем {user}")
        return Response({"message": "Сделка отменена!", "status": deal.status})





class MarkAsInTransitAPIView(APIView):
    """Перевод сделки в статус 'В дороге'"""
    permission_classes = [IsAuthenticated]

    def post(self, request, deal_id):
        deal = get_object_or_404(BarterDeal, id=deal_id)

        if deal.status != "started":
            return Response({"error": "Сделка должна быть в статусе 'Подтверждена', чтобы перейти в 'В дороге'."}, status=400)

        deal.status = "in_transit"
        deal.save()

        return Response({"message": "Сделка переведена в статус 'В дороге'", "status": deal.status}, status=200)


class MarkAsReceivedAPIView(APIView):
    """Подтверждение получения товара. Сделка завершается, если оба подтвердили."""
    permission_classes = [IsAuthenticated]

    def post(self, request, deal_id):
        deal = get_object_or_404(BarterDeal, id=deal_id)

        if deal.status != "in_transit":
            return Response({"error": "Сделка должна быть в статусе 'В дороге'."}, status=400)

        user = request.user
        if user == deal.initiator:
            deal.initiator_received = True
        elif user == deal.partner:
            deal.partner_received = True
        else:
            return Response({"error": "Вы не участник сделки."}, status=403)

        # Если оба подтвердили получение → сделка завершена
        if deal.initiator_received and deal.partner_received:
            deal.status = "completed"
            deal.save()
            return Response({
                "message": "Вы подтвердили получение!",
                "status": deal.status,
                "initiator_received": deal.initiator_received,
                "partner_received": deal.partner_received,
            }, status=200)

        deal.save()
        return Response({"message": "Вы подтвердили получение товара.", "status": deal.status}, status=200)


# 🔹 API для получения списка сделок пользователя
class UserDealsAPIView(generics.ListAPIView):
    serializer_class = BarterDealSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return BarterDeal.objects.filter(
            Q(initiator=self.request.user) | Q(partner=self.request.user)
        ).distinct()

# 🔹 API для чата
class DealChatAPIView(APIView):
    """Заглушка для чата сделки"""
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """Возвращает пустой список сообщений (заглушка)"""
        deal = get_object_or_404(BarterDeal, pk=pk)

        # Проверяем, является ли пользователь участником сделки
        if request.user != deal.initiator and request.user != deal.partner:
            return Response({"error": "Вы не участник сделки!"}, status=403)

        # Возвращаем заглушку (пустой чат)
        return Response({"messages": []})
