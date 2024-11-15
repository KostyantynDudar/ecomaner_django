# apps/accounts/utils/email_utils_sendgrid.py

import os
import requests
from django.conf import settings

SENDGRID_API_URL = "https://api.sendgrid.com/v3/mail/send"

def send_email_via_sendgrid(to_email, subject, html_content):
    # Тело запроса для API
    data = {
        "personalizations": [
            {
                "to": [{"email": to_email}],
                "subject": subject
            }
        ],
        "from": {"email": settings.DEFAULT_FROM_EMAIL},
        "content": [
            {"type": "text/html", "value": html_content}
        ]
    }

    # Заголовки, включая авторизацию через API-ключ
    headers = {
        "Authorization": f"Bearer {settings.SENDGRID_API_KEY}",
        "Content-Type": "application/json"
    }

    # Отправляем запрос
    response = requests.post(SENDGRID_API_URL, json=data, headers=headers)

    # Обработка ошибок
    if response.status_code != 202:
        raise Exception(f"Ошибка отправки письма: {response.status_code} - {response.text}")
