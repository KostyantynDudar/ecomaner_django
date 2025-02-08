#  backend/game/views.py

from django.shortcuts import render
from django.views import View

class GameView(View):
    def get(self, request):
        return render(request, 'game/game.html')
