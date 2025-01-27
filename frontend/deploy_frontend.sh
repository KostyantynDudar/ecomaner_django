#!/bin/bash

echo "=== Начинается сборка проекта ==="

# Устанавливаем необходимые переменные
FRONTEND_DIR="/home/ecomaner_django/frontend"
BUILD_DIR="$FRONTEND_DIR/build"
STATIC_DIR="/home/ecomaner_django/backend/staticfiles"

# Функция для управления PostgreSQL
control_postgres() {
    local action=$1
    if [ "$action" == "stop" ]; then
        echo "Остановка PostgreSQL..."
        sudo systemctl stop postgresql
        if [ $? -ne 0 ]; then
            echo "Ошибка при остановке PostgreSQL"
            exit 1
        fi
    elif [ "$action" == "start" ]; then
        echo "Запуск PostgreSQL..."
        sudo systemctl start postgresql
        if [ $? -ne 0 ]; then
            echo "Ошибка при запуске PostgreSQL"
            exit 1
        fi
    fi
}

# Отключаем PostgreSQL перед сборкой
control_postgres stop

# Переходим в папку фронтенда
cd "$FRONTEND_DIR" || { echo "Ошибка: не удалось перейти в директорию фронтенда"; exit 1; }

# Устанавливаем переменную для отключения ESLint
export DISABLE_ESLINT_PLUGIN=true

# Запускаем сборку проекта
npm run build
if [ $? -ne 0 ]; then
    echo "Ошибка сборки фронтенда"
    control_postgres start  # Включаем PostgreSQL даже в случае ошибки
    exit 1
fi
echo "Сборка завершена успешно."

# Удаляем старые файлы из папки статики
echo "Удаление старых файлов из $STATIC_DIR"
rm -rf "$STATIC_DIR"/* || { echo "Ошибка при удалении файлов из $STATIC_DIR"; control_postgres start; exit 1; }

# Копируем файлы сборки из папки `static` во вложенную структуру `staticfiles`
echo "Копирование файлов сборки в папку статики"
mkdir -p "$STATIC_DIR/static"  # Создаем папку static внутри staticfiles

# Копируем все файлы, при этом сохраняем подкаталоги, такие как js и css
cp -r "$BUILD_DIR/static/"* "$STATIC_DIR/" || { echo "Ошибка при копировании файлов"; control_postgres start; exit 1; }

# Перезагружаем Nginx для применения изменений
echo "Перезагрузка Nginx"
sudo systemctl reload nginx
if [ $? -ne 0 ]; then
    echo "Ошибка перезагрузки Nginx"
    control_postgres start
    exit 1
fi
echo "Nginx перезагружен."

# Включаем PostgreSQL после успешного завершения
control_postgres start

echo "=== Деплой завершен успешно ==="
