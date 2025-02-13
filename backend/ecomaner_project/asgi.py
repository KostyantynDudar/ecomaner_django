import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import apps.barter.routing  # 👈 Импортируем `routing.py` из barter

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ecomaner_project.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            apps.barter.routing.websocket_urlpatterns  # 👈 Подключаем маршруты WebSocket
        )
    ),
})
