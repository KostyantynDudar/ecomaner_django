#!/bin/bash

# Имена сервисов
backend_service="название_сервиса_бэка"  # Замените на имя сервиса бэка
deploy_service="название_сервиса_деплоя" # Замените на имя сервиса деплоя

echo "Перезапуск сервиса бэкенда: $backend_service..."
sudo systemctl restart "$backend_service"

# Проверка статуса перезапуска бэка
if systemctl is-active --quiet "$backend_service"; then
    echo "$backend_service успешно перезапущен."
else
    echo "Ошибка: $backend_service не удалось перезапустить!" >&2
    exit 1
fi

echo "Запуск сервиса деплоя: $deploy_service..."
sudo systemctl start "$deploy_service"

# Проверка статуса запуска деплоя
if systemctl is-active --quiet "$deploy_service"; then
    echo "$deploy_service успешно запущен."
else
    echo "Ошибка: $deploy_service не удалось запустить!" >&2
    exit 1
fi

echo "Все сервисы успешно запущены."
