from django.urls import re_path
from .consumers import DealConsumer

websocket_urlpatterns = [
    re_path(r'ws/barter/deal/(?P<deal_id>\d+)/$', DealConsumer.as_asgi()),
]
