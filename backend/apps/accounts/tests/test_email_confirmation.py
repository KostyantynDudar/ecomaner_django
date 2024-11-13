# backend/apps/accounts/tests/test_email_confirmation.py

import pytest
from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from django.core import mail  # Для проверки отправки
from apps.accounts.utils.email_utils import send_email  # Подключаем функцию
from django.conf import settings

User = get_user_model()

@pytest.mark.django_db
def test_email_confirmation(client):
    # Создаем пользователя
    user = User.objects.create_user(email="ecomaner@gmail.com", password="testpassword123")
    user.is_active = False  # Неактивный пользователь
    user.save()

    # Генерируем токен подтверждения
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    # Формируем ссылку для подтверждения и отправляем письмо
    confirm_url = f"{settings.SITE_URL}{reverse('accounts:confirm_email', args=[uid, token])}"
    subject = "Подтверждение регистрации"
    html_content = f'Для завершения регистрации перейдите по ссылке: <a href="{confirm_url}">подтвердить</a>'
    send_email("ecomaner@gmail.com", subject, html_content)

    # Проверяем, что письмо отправлено
    assert len(mail.outbox) == 1  # Проверка, что письмо отправлено
    assert mail.outbox[0].subject == subject
    assert confirm_url in mail.outbox[0].body

    # Переходим по ссылке для подтверждения
    response = client.get(reverse('accounts:confirm_email', args=[uid, token]))

    # Проверяем, что пользователь активирован
    user.refresh_from_db()
    assert response.status_code == 200
    assert user.is_active is True
    assert "Email подтвержден" in response.content.decode()

@pytest.mark.django_db
def test_invalid_token_confirmation(client):
    # Создаем пользователя
    user = User.objects.create_user(email="ecomaner@gmail.com", password="testpassword123")
    user.is_active = False
    user.save()

    # Генерируем токен с неверными данными
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    invalid_token = "invalid-token"

    # Переходим по ссылке с недействительным токеном
    response = client.get(reverse('accounts:confirm_email', args=[uid, invalid_token]))

    # Проверяем, что пользователь не активирован
    user.refresh_from_db()
    assert response.status_code == 200
    assert not user.is_active
    assert "Ссылка подтверждения недействительна или устарела" in response.content.decode()

@pytest.mark.django_db
def test_expired_token_confirmation(client):
    # Создаем пользователя
    user = User.objects.create_user(email="ecomaner@gmail.com", password="testpassword123")
    user.is_active = False
    user.save()

    # Генерируем токен подтверждения и декодируем UID
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    # Принудительно изменить токен (или можно дождаться истечения срока действия)
    # Здесь мы просто добавляем еще одну проверку на случай изменения токена

    # Применяем другой токен или старый для имитации просроченности
    user.is_active = False
    user.save()  # Перегенерация токена не допускает повторное использование

    # Переходим по ссылке с истекшим токеном
    response = client
