import os
import shutil

# Папка проекта
base_dir = "/home/ecomaner_django"
# Папки для анализа
backend_dir = os.path.join(base_dir, "backend")
frontend_dir = os.path.join(base_dir, "frontend")
# Папка для сохранения результата
output_dir = os.path.join(base_dir, "collected_files")
# Итоговый текстовый файл
output_text_file = os.path.join(output_dir, "collected_texts.txt")

# Расширения файлов, которые нужно включить
allowed_extensions = {".py", ".html", ".js", ".ts", ".css", ".json"}
# Исключить определённые файлы и папки
exclude_files = {"manage.py", "README.md"}
exclude_dirs = {"node_modules", "__pycache__", "staticfiles", "media", "build"}

# Функция для копирования нужных файлов
def collect_files(source_dir, target_dir):
    for root, dirs, files in os.walk(source_dir):
        # Исключаем нежелательные директории
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            # Проверяем расширение и исключаем ненужные файлы
            if any(file.endswith(ext) for ext in allowed_extensions) and file not in exclude_files:
                # Полный путь к файлу
                file_path = os.path.join(root, file)
                # Относительный путь для сохранения структуры папок
                rel_path = os.path.relpath(file_path, source_dir)
                # Путь назначения
                target_path = os.path.join(target_dir, rel_path)

                # Создаём директорию, если её нет
                os.makedirs(os.path.dirname(target_path), exist_ok=True)
                # Копируем файл
                shutil.copy2(file_path, target_path)

# Функция для извлечения текстов из файлов
def extract_texts(source_dir, output_file):
    with open(output_file, "w", encoding="utf-8") as output:
        for root, _, files in os.walk(source_dir):
            for file in files:
                # Проверяем расширение
                if any(file.endswith(ext) for ext in allowed_extensions):
                    # Полный путь к файлу
                    file_path = os.path.join(root, file)
                    try:
                        # Читаем содержимое файла
                        with open(file_path, "r", encoding="utf-8") as f:
                            content = f.read()

                        # Записываем в итоговый файл
                        output.write(f"--- FILE: {file_path} ---\n")
                        output.write(content)
                        output.write("\n\n")  # Разделение между файлами
                        print(f"Обработан файл: {file_path}")
                    except Exception as e:
                        # Обработка ошибок чтения файлов
                        output.write(f"--- FILE: {file_path} ---\n")
                        output.write(f"Ошибка чтения файла: {e}\n\n")
                        print(f"Ошибка чтения файла {file_path}: {e}")

# Основной процесс
def main():
    # Очищаем или создаём папку для результатов
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    os.makedirs(output_dir, exist_ok=True)

    # Собираем файлы из backend
    backend_output = os.path.join(output_dir, "backend")
    collect_files(backend_dir, backend_output)

    # Собираем файлы из frontend
    frontend_output = os.path.join(output_dir, "frontend")
    collect_files(frontend_dir, frontend_output)

    # Извлекаем тексты из всех собранных файлов
    extract_texts(output_dir, output_text_file)

    print(f"Файлы успешно собраны в папку {output_dir}")
    print(f"Тексты всех файлов сохранены в {output_text_file}")

if __name__ == "__main__":
    main()
