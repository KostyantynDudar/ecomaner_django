#!/bin/bash

echo "=== Начинается сборка проекта ==="

# Устанавливаем необходимые переменные
FRONTEND_DIR="/home/ecomaner_django/frontend"
BUILD_DIR="$FRONTEND_DIR/build"
STATIC_DIR="/home/ecomaner_django/backend/staticfiles"

# Переходим в папку фронтенда
cd "$FRONTEND_DIR" || { echo "Ошибка: не удалось перейти в директорию фронтенда"; exit 1; }

# Устанавливаем переменную для отключения ESLint (если нужно)
export DISABLE_ESLINT_PLUGIN=true

# Запускаем сборку проекта
npm run build
if [ $? -ne 0 ]; then
    echo "Ошибка сборки фронтенда"
    exit 1
fi
echo "Сборка завершена успешно."

# Удаляем старые файлы из папки статики
echo "Удаление старых файлов из $STATIC_DIR"
rm -rf "$STATIC_DIR"/* || { echo "Ошибка при удалении файлов из $STATIC_DIR"; exit 1; }

# Копируем файлы сборки в папку статики с вложенной папкой `static`
echo "Копирование файлов сборки в папку статики с вложенной структурой"
mkdir -p "$STATIC_DIR/static"  # Создаем папку static внутри staticfiles
cp -r "$BUILD_DIR/static/"* "$STATIC_DIR/static/" || { echo "Ошибка при копировании файлов"; exit 1; }

# Перезагружаем Nginx для применения изменений
echo "Перезагрузка Nginx"
sudo systemctl reload nginx
if [ $? -ne 0 ]; then
    echo "Ошибка перезагрузки Nginx"
    exit 1
fi
echo "Nginx перезагружен."

echo "=== Деплой завершен успешно ==="
