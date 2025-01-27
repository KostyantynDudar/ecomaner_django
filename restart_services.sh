#!/bin/bash

# Указываем путь для лог-файла
LOG_FILE="/home/ecomaner_django/restart_services.log"

# Очищаем старый лог-файл
echo "=== Лог перезапуска сервисов - $(date) =                 ==" > $LOG_FILE

# Функция для перезагрузки и проверки статуса systemd-сервиса с логированием
restart_and_check_systemd() {
  local service_name=$1
  local display_name=$2

  # Перезагружаем сервис и логируем вывод
  echo "Перезапуск $display_name..." >> $LOG_FILE
  sudo systemctl restart $service_name >> $LOG_FILE 2>&1

  # Проверяем статус и логируем результат
  if systemctl is-active --quiet $service_name; then
    echo "| $display_name     | Активен       |"
    echo "$display_name: Активен" >> $LOG_FILE
  else
    echo "| $display_name     | Не активен    |"
    echo "$display_name: Не активен" >> $LOG_FILE
  fi
}

# Функция для перезагрузки и проверки статуса pm2 сервиса с логированием
restart_and_check_pm2() {
  local process_name=$1
  local display_name=$2

  # Перезагружаем сервис через pm2 и логируем вывод
  echo "Перезапуск $display_name через pm2..." >> $LOG_FILE
  if pm2 restart $process_name >> $LOG_FILE 2>&1; then
    echo "| $display_name     | Активен       |"
    echo "$display_name: Активен" >> $LOG_FILE
  else
    echo "| $display_name     | Не активен    |"
    echo "$display_name: Не активен" >> $LOG_FILE
  fi
}

# Начало вывода таблички
echo "+----------------+------------------+"
echo "| Сервис         | Статус           |"
echo "+----------------+------------------+"

# Перезагрузка и проверка всех необходимых сервисов
restart_and_check_systemd "postgresql" "PostgreSQL"
restart_and_check_systemd "nginx" "Nginx"
restart_and_check_pm2 "pm2" "Node.js"  # Укажите имя приложения в pm2, например, "app_name"
restart_and_check_systemd "gunicorn" "Django (Gunicorn)"  # Убедитесь, что имя сервиса верное

# Конец вывода таблички
echo "+----------------+------------------+"

# Сообщение о завершении
echo "Перезапуск завершен. Подробный лог доступен в $LOG_FILE"
