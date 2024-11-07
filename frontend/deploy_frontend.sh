#!/bin/bash

echo "=== Начинается сборка проекта ==="

# Устанавливаем необходимые переменные
FRONTEND_DIR="/home/ecomaner_django/frontend"
BUILD_DIR="$FRONTEND_DIR/build"
STATIC_DIR="/home/ecomaner_django/backend/staticfiles"

# Переходим в папку фронтенда
cd "$FRONTEND_DIR" || exit 1

# Устанавливаем переменную для отключения ESLint (если нужно)
export DISABLE_ESLINT_PLUGIN=true

# Запускаем сборку проекта
npm run build
if [ $? -ne 0 ]; then
    echo "Ошибка сборки фронтенда"
    exit 1
fi
echo "Сборка завершена успешно."

# Перемещаем файлы сборки в папку для статики
echo "Копирование файлов сборки в папку статики"
rm -rf "$STATIC_DIR/*"  # Удаляем старые файлы
cp -r "$BUILD_DIR/"* "$STATIC_DIR/"

# Перезагружаем Nginx для применения изменений
echo "Перезагрузка Nginx"
sudo systemctl reload nginx
if [ $? -ne 0 ]; then
    echo "Ошибка перезагрузки Nginx"
    exit 1
fi
echo "Nginx перезагружен."

echo "=== Деплой завершен успешно ==="

