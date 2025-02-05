#!/bin/bash

# Директории проекта
BACKEND_DIR="/home/ecomaner_django/backend"
FRONTEND_DIR="/home/ecomaner_django/frontend"

# Выходные файлы
BACKEND_OUTPUT="backend_files.txt"
FRONTEND_OUTPUT="frontend_files.txt"

# Очищаем старые файлы
> "$BACKEND_OUTPUT"
> "$FRONTEND_OUTPUT"

echo "🔍 Собираем файлы бэкенда..."
find "$BACKEND_DIR" -type f \( \
    -name "*.py" -o \
    -name "*.json" -o \
    -name "requirements.txt" -o \
    -name "gunicorn.service" -o \
    -name "*.conf" -o \
    -name "Dockerfile" -o \
    -name "manage.py" \
    \) ! -path "$BACKEND_DIR/venv/*" > "$BACKEND_OUTPUT"

echo "✅ Файл $BACKEND_OUTPUT готов."

echo "🔍 Собираем файлы фронтенда..."
find "$FRONTEND_DIR" -type f \( \
    -name "*.js" -o \
    -name "*.jsx" -o \
    -name "*.ts" -o \
    -name "*.tsx" -o \
    -name "*.json" -o \
    -name "package.json" -o \
    -name "webpack.config.js" -o \
    -name "vite.config.js" \
    \) ! -path "$FRONTEND_DIR/node_modules/*" > "$FRONTEND_OUTPUT"

echo "✅ Файл $FRONTEND_OUTPUT готов."

echo "🎯 Готово! Списки файлов сохранены."
