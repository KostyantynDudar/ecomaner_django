#!/bin/bash

# Список сервисов, которые необходимо перезапустить
services=(
    "django"
    "gunicorn"

    "nginx"

)

echo "Перезапуск сервисов для бэкенда..."

# Функция для перезапуска сервиса и проверки его статуса
restart_and_check_status() {
    local service=$1

    echo "Перезапуск $service..."
    sudo systemctl restart "$service"

    # Проверка статуса сервиса
    echo "Проверка статуса $service..."
    sudo systemctl is-active --quiet "$service"
    if [ $? -eq 0 ]; then
        echo "$service: запущен успешно."
    else
        echo "$service: не удалось запустить!" >&2
        sudo systemctl status "$service"  # Вывод статуса в случае ошибки
    fi
    echo "-----------------------------------"
}

# Перезапуск и проверка каждого сервиса
for service in "${services[@]}"; do
    restart_and_check_status "$service"
done

echo "Все сервисы обработаны."
