from django.shortcuts import render
from django.contrib.auth.decorators import login_required

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
