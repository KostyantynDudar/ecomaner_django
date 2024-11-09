#!/bin/bash

# Названия служб, которые необходимо проверить
declare -A services=(
    ["PostgreSQL"]="postgresql"
    ["Django"]="django"
    ["Nginx"]="nginx"
)

# Функция для проверки статуса службы
check_service() {
    if systemctl is-active --quiet "$1"; then
        echo -e "\e[32mАктивен\e[0m"  # Зелёный цвет для активных сервисов
    else
        echo -e "\e[31mНе активен\e[0m"  # Красный цвет для неактивных сервисов
    fi
}

# Заголовок таблицы
echo -e "\n+----------------+------------------+"
echo -e "| Сервис         | Статус           |"
echo -e "+----------------+------------------+"

# Проверка статуса каждого сервиса и вывод результата в таблицу
for service in "${!services[@]}"; do
    status=$(check_service "${services[$service]}")
    printf "| %-14s | %-16s |\n" "$service" "$status"
done

echo -e "+----------------+------------------+\n"
