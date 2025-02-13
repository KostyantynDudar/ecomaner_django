from django.urls import re_path
from .consumers import TradeConsumer  # ✅ Используем правильный импорт

websocket_urlpatterns = [
    re_path(r'ws/barter/deal/(?P<deal_id>\d+)/$', TradeConsumer.as_asgi()),  # ✅ Теперь всё правильно!
]
