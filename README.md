# Ecomaner Project

Проект **Ecomaner** — это веб-приложение, построенное на **Django** (серверная часть) и **React** (клиентская часть), с использованием **Nginx** и **Gunicorn** для продакшен-сервера. Ниже приведено подробное описание инфраструктуры и работы приложения.

## Архитектура проекта

- **Клиентская часть**: React-приложение, собираемое в статические файлы.
- **Серверная часть**: Django-приложение, работающее через Gunicorn.
- **Обратный прокси**: Nginx, обрабатывающий запросы к серверу, статику и API.

## Локальная разработка

Для локальной разработки установите зависимости и запустите серверы для Django и React.

1. **Запуск Django-сервера**:
    ```bash
    python manage.py runserver
    ```

2. **Запуск React-сервера**:
    ```bash
    npm start
    ```

## Деплой на продакшен

### 1. Сборка React-приложения

Создайте оптимизированную сборку React-приложения:
```bash
npm run build







Настройка Nginx
Nginx используется для проксирования запросов к Django и раздачи статических файлов. Пример конфигурации для /etc/nginx/sites-available/ecomaner:

nginx
Копировать код
# HTTP сервер для автоматического перенаправления на HTTPS
server {
    listen 80;
    server_name ecomaner.com www.ecomaner.com;
    return 301 https://$host$request_uri;

    root /var/www/ecomaner.com/public_html;
    index index.html index.htm;

    location / {
        try_files $uri /index.html;
    }
}

# HTTPS сервер для Django и React-приложений
server {
    listen 443 ssl;
    server_name ecomaner.com www.ecomaner.com;

    # SSL сертификаты
    ssl_certificate /etc/letsencrypt/live/ecomaner.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ecomaner.com/privkey.pem;

    # Статика Django
    location /static/ {
        alias /home/ecomaner_django/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # Медиа-файлы Django
    location /media/ {
        alias /home/ecomaner_django/backend/media/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }

    # API Django (Gunicorn)
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Статика React
    location / {
        root /home/ecomaner_django/frontend/build;
        try_files $uri /index.html;
    }
}
3. Настройка Django и Gunicorn
Запустите Gunicorn для обработки Django-запросов:

bash
Копировать код
gunicorn ecomaner_project.wsgi:application --bind 127.0.0.1:8000 --workers 3
4. SSL
Для обеспечения безопасности используется сертификат Let's Encrypt. Настройка сертификатов осуществляется в конфигурации Nginx.

Работа приложения
Полный цикл запроса
Запрос от клиента: Пользователь на сайте выполняет действие, запускающее запрос на https://ecomaner.com/api/.
Проксирование в Nginx:
Если это запрос к API (/api/...), Nginx перенаправляет его на Gunicorn (http://127.0.0.1:8000).
Если это запрос на статику (/static/ или /media/), Nginx обрабатывает его напрямую из соответствующих папок.
Если это запрос к React-приложению, Nginx раздаёт файлы из сборки React.
Обработка Django: Django обрабатывает API-запросы, обращается к базе данных при необходимости и формирует JSON-ответ.
Ответ от Nginx: Ответ от сервера возвращается клиенту, где React обновляет интерфейс на основе полученных данных.
Пример запроса на главную страницу
Пользователь заходит на сайт https://ecomaner.com/.
React отправляет запрос к https://ecomaner.com/api/main/home/.
Nginx перенаправляет запрос на Gunicorn, который обрабатывает его через Django.
Django возвращает данные, и они отображаются в React.
Примечания
SSL-сертификат: Убедитесь, что сертификаты SSL обновляются автоматически через cron.
Переменные окружения:
REACT_APP_API_BASE_URL: Используется в React для указания базового URL API.
Кэширование: Статические файлы кэшируются Nginx для оптимизации загрузки.
Возможные проблемы
403 Forbidden: Убедитесь, что директории и файлы имеют правильные права доступа.
404 для статики: Проверьте, что Nginx ссылается на правильные пути для статики.
