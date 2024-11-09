#!/bin/bash

# Путь к скриптам
BACKEND_SCRIPT="/home/ecomaner_django/backend/restart_services.sh"
FRONTEND_SCRIPT="/home/ecomaner_django/frontend/deploy_frontend.sh"

echo "Запуск перезапуска бэкенда..."
sudo bash "$BACKEND_SCRIPT"

# Проверка статуса выполнения скрипта для бэкенда
if [ $? -eq 0 ]; then
    echo "Бэкенд успешно перезапущен."
else
    echo "Ошибка: не удалось перезапустить бэкенд!" >&2
    exit 1
fi

echo "Запуск деплоя фронтенда..."
sudo bash "$FRONTEND_SCRIPT"

# Проверка статуса выполнения скрипта для фронтенда
if [ $? -eq 0 ]; then
    echo "Фронтенд успешно запущен."
else
    echo "Ошибка: не удалось запустить фронтенд!" >&2
    exit 1
fi

echo "Бэкенд и фронтенд успешно перезапущены."
