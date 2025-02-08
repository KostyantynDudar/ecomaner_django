from django.urls import path
from .views import GameView  # Импортируем класс

urlpatterns = [
    path('', GameView.as_view(), name='game'),  # Добавляем вызов .as_view()
]
