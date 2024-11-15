# apps/accounts/tests/test_email_confirmation.py
import pytest
from django.urls import reverse
from unittest.mock import patch
from apps.accounts.utils.email_utils import send_email

@pytest.mark.django_db
@patch("apps.accounts.utils.email_utils.send_email")  # Мокируем send_email
def test_email_confirmation_code_sent(mock_send_email, client):
    """
    Тест для проверки отправки кода подтверждения при регистрации.
    """
    response = client.post(reverse('accounts:register'), {
        'email': 'dubrovski82@ukr.net',
        'password': 'testpassword123'
    })

    # Проверяем, что send_email был вызван
    assert mock_send_email.call_count == 1

    # Проверка аргументов вызова send_email
    args, kwargs = mock_send_email.call_args
    print("Отладка args:", args)
    print("Отладка kwargs:", kwargs)

    assert args[0] == "dubrovski82@ukr.net"  # email
    assert "Подтверждение регистрации" in args[1]  # subject
    assert args[2] is not None  # код подтверждения
