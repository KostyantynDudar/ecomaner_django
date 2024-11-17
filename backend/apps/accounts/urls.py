# ecomaner_django-master/backend/apps/accounts/urls.py

from django.urls import path
from . import views
from django.contrib.auth.views import LoginView

app_name = 'accounts'

urlpatterns = [
    # Маршрут для страницы регистрации
    path('register/', views.register_user, name='register'),

    path('confirm-code/', views.confirm_email_code, name='confirm_email_code'),  # Подтверждение кода

    path('login/', views.login_view, name='login'),

    path('api-login/', views.login_user_api, name='login_user_api'),

    path('logout/', views.logout_user_api, name='logout_api'),

    path('profile/', views.user_profile, name='user_profile'),  # новый маршрут

    path('check-auth/', views.check_authentication, name='check_auth'),

]
