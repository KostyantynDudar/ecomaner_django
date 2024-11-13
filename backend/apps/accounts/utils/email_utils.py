# backend/utils/email_utils.py
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Email, Content
from django.conf import settings


def send_email(to_email, subject, html_content):
    try:
        sg = SendGridAPIClient(api_key=settings.SENDGRID_API_KEY)
        mail_json = {
            "personalizations": [{"to": [{"email": to_email}], "subject": subject}],
            "from": {"email": "info@ecomaner.com"},
            "content": [{"type": "text/html", "value": html_content}]
        }
        response = sg.client.mail.send.post(request_body=mail_json)
        
        # Проверка успешности отправки
        if response.status_code == 202:
            print("Письмо успешно отправлено.")
        else:
            print("Ошибка отправки письма:", response.status_code)

    except Exception as e:
        print(f"Ошибка: {e}")
