import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, Content

# Убедитесь, что API-ключ указан корректно
SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY')  # Замените на ваш реальный API ключ

# Функция для отправки тестового письма
def send_test_email():
    try:
        # Инициализация SendGrid API-клиента
        sg = SendGridAPIClient(api_key=SENDGRID_API_KEY)
        
        # Настройка тестового письма
        from_email = Email("info@ecomaner.com")  # Адрес отправителя (должен быть верифицирован)
        to_email = Email("ecomaner@gmail.com")  # Адрес получателя
        subject = "Тестовое письмо от SendGrid"
        content = Content("text/html", "<strong>Это тестовое письмо, отправленное с помощью SendGrid API.</strong>")
        
        # Создание объекта Mail
        mail = Mail(from_email=from_email, to_email=to_email, subject=subject)
        mail.add_content(content)  # Добавляем контент письма

        # Ручное создание JSON-структуры для проверки
        mail_json = {
            "personalizations": [{
                "to": [{"email": to_email.email}],
                "subject": subject
            }],
            "from": {"email": from_email.email},
            "content": [{"type": content.type, "value": content.value}]
        }

        # Вывод JSON-структуры для проверки
        print("JSON body to be sent to SendGrid:", mail_json)

        # Отправка письма через API (вместо sg.send)
        response = sg.client.mail.send.post(request_body=mail_json)
        
        # Вывод статуса ответа
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.body}")
        print(f"Response Headers: {response.headers}")
        
        # Проверка успешности отправки
        if response.status_code == 202:
            print("Письмо успешно отправлено.")
        else:
            print("Письмо не отправлено. Проверьте настройки и API-ключ.")

    except Exception as e:
        print(f"Ошибка: {e}")

# Вызов функции для отправки письма
if __name__ == "__main__":
    send_test_email()