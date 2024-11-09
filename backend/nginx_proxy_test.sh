#!/bin/bash

# Перечень API URL для проверки
urls=("https://ecomaner.com/news/api/news/"
      "https://ecomaner.com/api/main/home/"
      "https://ecomaner.com/api/locations/"
      "https://ecomaner.com/admin/")

# Путь к лог-файлу Nginx
nginx_error_log="/var/log/nginx/error.log"
nginx_access_log="/var/log/nginx/access.log"

# Временный лог-файл для записи результатов
temp_log="nginx_proxy_test_results.log"

echo "=== Проверка состояния API и админки ===" > "$temp_log"

# Проверка каждого URL
for url in "${urls[@]}"; do
    echo "Проверка $url" | tee -a "$temp_log"
    
    # Выполнение запроса и извлечение кода состояния и заголовков
    response=$(curl -I -s "$url")
    status_code=$(echo "$response" | grep HTTP | awk '{print $2}')
    
    echo "$response" | tee -a "$temp_log"
    
    # Если 404, ищем ошибки в логах Nginx
    if [ "$status_code" == "404" ]; then
        echo "Статус 404 найден для $url. Проверка логов Nginx..." | tee -a "$temp_log"
        
        # Ищем в логах последние 10 строк, относящиеся к этому URL
        echo -e "\n--- Последние записи в error.log ---" | tee -a "$temp_log"
        grep "$url" "$nginx_error_log" | tail -n 10 | tee -a "$temp_log"
        
        echo -e "\n--- Последние записи в access.log ---" | tee -a "$temp_log"
        grep "$url" "$nginx_access_log" | tail -n 10 | tee -a "$temp_log"
        
        # Повторный запрос с отладочными заголовками
        echo -e "\n--- Повторный запрос с отладочными заголовками ---" | tee -a "$temp_log"
        curl -I -v "$url" 2>&1 | tee -a "$temp_log"
    fi

    echo -e "\n--- Конец проверки для $url ---\n" | tee -a "$temp_log"
done

echo "Результаты проверки записаны в $temp_log"
