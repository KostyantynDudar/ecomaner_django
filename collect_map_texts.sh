#!/bin/bash

# Файлы, куда будем сохранять текст
BACKEND_FILE="map_backend.txt"
FRONTEND_FILE="map_frontend.txt"

# Очищаем файлы перед сборкой
> "$BACKEND_FILE"
> "$FRONTEND_FILE"

# Функция для добавления содержимого файла в нужный текстовый файл
extract_text() {
    local file_path="$1"
    local output_file="$2"

    if [[ -f "$file_path" ]]; then
        echo "══════════════════════════════════════════════" >> "$output_file"
        echo "📌 FILE: $file_path" >> "$output_file"
        echo "══════════════════════════════════════════════" >> "$output_file"
        cat "$file_path" >> "$output_file"
        echo -e "\n\n" >> "$output_file"
    fi
}

echo "🔄 Извлекаем файлы бэкенда..."
extract_text "backend/ecomaner_project/settings.py" "$BACKEND_FILE"
extract_text "backend/ecomaner_project/urls.py" "$BACKEND_FILE"

for file in backend/apps/eco_map/*.py; do
    extract_text "$file" "$BACKEND_FILE"
done

echo "🔄 Извлекаем файлы фронтенда..."
for file in frontend/src/pages/*.js; do
    extract_text "$file" "$FRONTEND_FILE"
done

for file in frontend/src/components/*.js; do
    extract_text "$file" "$FRONTEND_FILE"
done

extract_text "frontend/src/api/map.js" "$FRONTEND_FILE"
extract_text "frontend/src/redux/mapSlice.js" "$FRONTEND_FILE"
extract_text "frontend/src/constants/map.js" "$FRONTEND_FILE"

# Исправление возможных проблем с кодировкой (если скрипт создан в Windows)
dos2unix "$0" 2>/dev/null || sed -i 's/
$//' "$0"

# Даем права на выполнение
chmod +x "$0"

echo "✅ Сборка завершена!"
echo "🔹 Бэкенд: $BACKEND_FILE"
echo "🔹 Фронтенд: $FRONTEND_FILE"
