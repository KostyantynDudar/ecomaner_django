# ecomaner_django-master/backend/apps/accounts/urls.py

from django.urls import path
from . import views
from django.contrib.auth.views import LoginView

app_name = 'accounts'

urlpatterns = [
    # Маршрут для страницы регистрации
    path('register/', views.register_user, name='register'),

    # Маршрут для подтверждения email (активация аккаунта)
    path('confirm/<uidb64>/<token>/', views.confirm_email, name='confirm_email'),

    # Маршрут для страницы успешной регистрации
    path('registration-success/', views.registration_success, name='registration_success'),

    path('login/', views.login_view, name='login'),
]
