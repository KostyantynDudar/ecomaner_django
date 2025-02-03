import os
import shutil

# Папка проекта
base_dir = "/home/ecomaner_django"

# Папки для анализа
backend_dir = os.path.join(base_dir, "backend")
frontend_dir = os.path.join(base_dir, "frontend")

# Папка для сохранения результатов
output_dir = os.path.join(base_dir, "collected_files")
# Итоговый текстовый файл с содержимым всех собранных файлов
output_text_file = os.path.join(output_dir, "collected_texts.txt")

# Расширения файлов, которые нужно включить (дополнительно .md, .txt, .env)
allowed_extensions = {".py", ".html", ".js", ".ts", ".css", ".json", ".md", ".txt", ".env"}

# Файлы, которые всегда нужно включить, даже если у них нет расширения или другое имя
extra_files = {"Dockerfile", "requirements.txt", "Pipfile", "Makefile", "Procfile"}

# Исключить определённые файлы и папки
exclude_files = {"manage.py", "README.md"}
exclude_dirs = {"node_modules", "__pycache__", "staticfiles", "media", "build"}

def collect_files(source_dir, target_dir):
    """
    Копирует файлы из source_dir в target_dir, соблюдая структуру папок.
    Файл копируется, если его расширение входит в allowed_extensions или имя в extra_files.
    """
    for root, dirs, files in os.walk(source_dir):
        # Исключаем нежелательные директории
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        for file in files:
            file_ext = os.path.splitext(file)[1].lower()
            # Если расширение разрешено или файл есть в extra_files, и он не исключён
            if (file_ext in allowed_extensions or file in extra_files) and file not in exclude_files:
                file_path = os.path.join(root, file)
                # Относительный путь для сохранения структуры папок
                rel_path = os.path.relpath(file_path, source_dir)
                target_path = os.path.join(target_dir, rel_path)
                os.makedirs(os.path.dirname(target_path), exist_ok=True)
                shutil.copy2(file_path, target_path)
                print(f"Скопирован: {file_path} -> {target_path}")

def collect_root_files(root_dir, target_dir):
    """
    Собирает важные файлы из корневой папки проекта, которые могут не попадать
    в обход по backend/frontend. Файлы сохраняются в target_dir/root_files.
    """
    for file in os.listdir(root_dir):
        full_path = os.path.join(root_dir, file)
        if os.path.isfile(full_path):
            file_ext = os.path.splitext(file)[1].lower()
            if (file_ext in allowed_extensions or file in extra_files) and file not in exclude_files:
                target_path = os.path.join(target_dir, "root_files", file)
                os.makedirs(os.path.dirname(target_path), exist_ok=True)
                shutil.copy2(full_path, target_path)
                print(f"Скопирован из корня: {full_path} -> {target_path}")

def extract_texts(source_dir, output_file):
    """
    Извлекает тексты из файлов, имеющих нужные расширения или входящих в extra_files,
    и записывает их в итоговый текстовый файл с указанием пути исходного файла.
    """
    with open(output_file, "w", encoding="utf-8") as output:
        for root, _, files in os.walk(source_dir):
            for file in files:
                file_ext = os.path.splitext(file)[1].lower()
                if file_ext in allowed_extensions or file in extra_files:
                    file_path = os.path.join(root, file)
                    try:
                        with open(file_path, "r", encoding="utf-8") as f:
                            content = f.read()
                        output.write(f"--- FILE: {file_path} ---\n")
                        output.write(content)
                        output.write("\n\n")  # Разделение между файлами
                        print(f"Обработан файл: {file_path}")
                    except Exception as e:
                        output.write(f"--- FILE: {file_path} ---\n")
                        output.write(f"Ошибка чтения файла: {e}\n\n")
                        print(f"Ошибка чтения файла {file_path}: {e}")

def main():
    # Очищаем или создаём папку для результатов
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    os.makedirs(output_dir, exist_ok=True)

    # Собираем файлы из папки backend
    backend_output = os.path.join(output_dir, "backend")
    collect_files(backend_dir, backend_output)

    # Собираем файлы из папки frontend
    frontend_output = os.path.join(output_dir, "frontend")
    collect_files(frontend_dir, frontend_output)

    # Собираем важные файлы из корневой папки проекта
    collect_root_files(base_dir, output_dir)

    # Извлекаем тексты из всех собранных файлов
    extract_texts(output_dir, output_text_file)

    print(f"\nФайлы успешно собраны в папку: {output_dir}")
    print(f"Тексты всех файлов сохранены в: {output_text_file}")

if __name__ == "__main__":
    main()
