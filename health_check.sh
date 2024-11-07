#!/bin/bash

# Массив URL-адресов, которые нужно проверить
declare -A urls=(
    ["Главная страница"]="https://ecomaner.com/"
    ["API: Главная"]="https://ecomaner.com/api/main/home/"
    ["API: Участие"]="https://ecomaner.com/api/participation/"
    ["API: Новости"]="https://ecomaner.com/api/news/"
    # Добавьте сюда другие URL-адреса, которые хотите проверить
)

# Функция для проверки URL и вывода результата
check_url() {
    local name=$1
    local url=$2

    # Выполнение curl-запроса с выводом только HTTP-кода
    status_code=$(curl -o /dev/null -s -w "%{http_code}" "$url")

    # Анализ кода ответа
    if [ "$status_code" -eq 200 ]; then
        echo -e "| $name | $url | \e[32m$status_code OK\e[0m |"
    else
        echo -e "| $name | $url | \e[31m$status_code Error\e[0m |"
    fi
}

# Заголовок таблицы
echo -e "| Название | URL | Статус |"
echo -e "|----------|-----|--------|"

# Проверка всех URL-адресов из массива
for name in "${!urls[@]}"; do
    check_url "$name" "${urls[$name]}"
done
