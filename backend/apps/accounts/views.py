# backend/apps/accounts/views.py

from django.shortcuts import render, redirect
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

from django.http import HttpResponse
from .forms import RegisterForm
import requests
from apps.accounts.utils.email_utils import send_email
from django.conf import settings
from apps.accounts.utils.email_utils_sendgrid import send_email_via_sendgrid
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

import logging
logger = logging.getLogger(__name__)  # Логгер для отслеживания шагов

User = get_user_model()

@csrf_exempt
def register_user(request):
    logger.info("Начало процесса регистрации")

    if request.method == "POST":
        try:
            # Чтение JSON-данных из request.body
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')
            logger.debug(f"Получен email: {email} и пароль: {password}")

            # Проверка наличия email и password
            if not email or not password:
                logger.warning("Отсутствует email или пароль")
                return JsonResponse({'error': 'Email and password are required.'}, status=400)

            # Создание пользователя
            user = User.objects.create_user(email=email, password=password)
            user.is_active = False
            user.generate_confirmation_code()
            user.save()

            logger.info(f"Пользователь {email} создан и сохранен с кодом подтверждения: {user.email_confirmation_code}")

            # Отправка кода подтверждения на email
            send_email(email, 'Подтверждение регистрации', user.email_confirmation_code)
            logger.info("Отправка email завершена")

            # Возврат успешного ответа
            return JsonResponse({'message': 'Регистрация прошла успешно. Проверьте свою почту для подтверждения.'}, status=201)

        except json.JSONDecodeError:
            logger.error("Неверный формат JSON в запросе")
            return JsonResponse({'error': 'Invalid JSON format.'}, status=400)
    else:
        logger.warning("Неподдерживаемый метод для регистрации")
        return JsonResponse({'error': 'Неподдерживаемый метод'}, status=405)


# backend/apps/accounts/views.py

@csrf_exempt
def confirm_email_code(request):
    logger.info("Начало процесса подтверждения email-кода")

    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get('email')
            code = data.get('code')
            logger.debug(f"Получены данные для подтверждения: email {email}, код {code}")

            if not email or not code:
                logger.warning("Отсутствует email или код")
                return JsonResponse({'error': 'Email и код обязательны.'}, status=400)

            try:
                user = User.objects.get(email=email, email_confirmation_code=code)
                user.is_active = True
                user.email_confirmation_code = None
                user.save()
                logger.info(f"Пользователь {email} успешно активирован")
                return JsonResponse({'message': 'Аккаунт успешно активирован'}, status=200)
            except User.DoesNotExist:
                logger.warning(f"Ошибка подтверждения для пользователя {email}: неверный код")
                return JsonResponse({'error': 'Неверный код подтверждения или email'}, status=400)

        except json.JSONDecodeError:
            logger.error("Неверный формат JSON в запросе")
            return JsonResponse({'error': 'Invalid JSON format.'}, status=400)
        except Exception as e:
            logger.error(f"Ошибка при подтверждении кода: {str(e)}")
            return JsonResponse({'error': 'Ошибка сервера. Повторите попытку позже.'}, status=500)
    else:
        logger.warning("Неподдерживаемый метод для подтверждения кода")
        return JsonResponse({'error': 'Неподдерживаемый метод'}, status=405)



# Функция для успешной регистрации
@csrf_exempt
def registration_success(request):
    logger.info("Отображение страницы успешной регистрации")
    return HttpResponse("Регистрация прошла успешно. Проверьте вашу электронную почту для подтверждения.")

@csrf_exempt
def login_view(request):
    logger.info("Показ страницы входа")

    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            logger.info(f"Успешная аутентификация для {user.email}")
            login(request, user)
            return redirect('home')
        else:
            logger.warning("Неудачная попытка входа")
            return render(request, 'accounts/login.html', {'form': form, 'error': 'Неверный email или пароль'})
    else:
        form = AuthenticationForm()
    return render(request, 'accounts/login.html', {'form': form})


@csrf_exempt
def login_user_api(request):
    logger.info("Получен API-запрос на вход")
    logger.debug(f"Метод запроса: {request.method}, Заголовки: {request.headers}")

    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        logger.debug(f"API-запрос входа с email: {email}")

        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            login(request, user)
            logger.info(f"Успешный вход через API для {email}")
            return JsonResponse({'message': 'Успешный вход'}, status=200)
        else:
            logger.warning(f"Неудачный вход через API для {email}")
            return JsonResponse({'message': 'Неверные данные для входа'}, status=400)
    logger.warning("Использован неподдерживаемый метод для API")
    return JsonResponse({'error': 'Неподдерживаемый метод'}, status=405)

@csrf_exempt
def logout_user_api(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'message': 'Успешный выход'}, status=200)
    return JsonResponse({'error': 'Неподдерживаемый метод'}, status=405)



import logging
logger = logging.getLogger(__name__)

@login_required
def user_profile(request):
    try:
        user = request.user
        logging.debug(f"Доступные поля пользователя: {user.__dict__}")
        data = {
            'name': user.get_full_name() if hasattr(user, 'get_full_name') else user.email,
            'email': user.email,
        }
        return JsonResponse(data)
    except Exception as e:
        logging.error(f"Ошибка при получении профиля: {str(e)}")
        return JsonResponse({'error': 'Internal Server Error'}, status=500)




from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

def check_authentication(request):
    if request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': True})
    return JsonResponse({'isAuthenticated': False})

