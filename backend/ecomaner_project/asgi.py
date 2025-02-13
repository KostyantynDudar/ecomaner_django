import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "ecomaner_project.settings")
django.setup()  # ✅ Загружаем Django перед импортом других модулей

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import apps.barter.routing  # ✅ Теперь импорт работает

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            apps.barter.routing.websocket_urlpatterns
        )
    ),
})
