from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.http import HttpResponse
from .forms import RegisterForm
from .utils.email_utils import send_email  # Подключаем рабочую функцию отправки письма
from django.conf import settings

import logging
logger = logging.getLogger(__name__)  # Логгер для отслеживания шагов

User = get_user_model()

# Функция регистрации пользователя
def register_user(request):
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            user = User.objects.create_user(email=email, password=password)
            user.is_active = False  # Делаем пользователя неактивным до подтверждения email
            user.save()

            # Генерация токена для подтверждения email
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            confirm_url = request.build_absolute_uri(reverse('accounts:confirm_email', args=[uid, token]))
            logger.info(f"Ссылка для подтверждения: {confirm_url}")  # Логируем ссылку

            # Используем функцию отправки email
            subject = 'Подтверждение регистрации'
            html_content = f'Для завершения регистрации перейдите по ссылке: <a href="{confirm_url}">подтвердить</a>'
            send_email(email, subject, html_content)  # Отправка email
            logger.info(f"Email отправлен на: {email}")  # Логируем отправку email

            return redirect('accounts:registration_success')
    else:
        form = RegisterForm()

    return render(request, 'accounts/register.html', {'form': form})

# Функция подтверждения email
def confirm_email(request, uidb64, token):
    try:
        # Декодируем uid и получаем пользователя
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
        logger.info(f"Пользователь найден: {user.email}")  # Логируем пользователя
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
        logger.error("Пользователь не найден или неверный uid")  # Логируем ошибку

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True  # Активируем пользователя
        user.save()
        logger.info("Email успешно подтвержден")  # Логируем успешное подтверждение
        return render(request, 'accounts/email_confirmed.html')  # Используем шаблон для подтверждения
    else:
        logger.warning("Ссылка подтверждения недействительна или устарела")  # Логируем недействительную ссылку
        return render(request, 'accounts/email_confirmation_invalid.html')  # Шаблон для недействительной ссылки


# Функция для успешной регистрации
def registration_success(request):
    return HttpResponse("Регистрация прошла успешно. Проверьте вашу электронную почту для подтверждения.")

def login_view(request):
    # Логика для страницы входа
    return render(request, 'accounts/templates/accounts/login.html')


