# backend/utils/email_utils.py

import os
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Email, Content
from django.conf import settings

logger = logging.getLogger(__name__)

def send_email(to_email, subject, body):
    logger.info(f"Попытка отправки подтверждающего письма на адрес: {to_email}")
    logger.debug(f"Подготовка к отправке email на {to_email} с темой {subject}")

    try:
        sg = SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)
        mail_json = {
            "personalizations": [{"to": [{"email": to_email}], "subject": subject}],
            "from": {"email": "info@ecomaner.com"},
            "content": [{"type": "text/html", "value": body}]
        }
        response = sg.client.mail.send.post(request_body=mail_json)

        # Проверка успешности отправки
        if response.status_code == 202:
            logger.info(f"Письмо успешно отправлено на адрес {to_email}")
            print("Письмо успешно отправлено.")
        else:
            logger.error(f"Ошибка отправки письма на адрес {to_email}: статус {response.status_code}")
            print("Ошибка отправки письма:", response.status_code)

    except Exception as e:
        logger.error(f"Ошибка при попытке отправки письма на адрес {to_email}: {e}")
        print(f"Ошибка: {e}")
