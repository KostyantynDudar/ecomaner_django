import os

# Указываем корневую папку проекта
PROJECT_ROOT = "./"  # Поменяйте на нужный путь, если требуется
# Путь и название итогового файла
OUTPUT_FILE = "merged_registration_files.txt"
# Папки и файлы для объединения
TARGET_DIRS = [
    "backend/apps/accounts",    # Папка с основными функциями регистрации
    "frontend/src",             # Папка с кодом фронтенда
]
# Список файлов для поиска по частичному названию, чтобы охватить все нужное
TARGET_FILES = [
    "views.py", 
    "urls.py",
    "forms.py",
    "utils.py", 
    "api.js",                   # Например, если есть API-логика на фронтенде
    "auth.js",                  # Другие нужные файлы
    "registration.js"
]

def collect_files():
    """Функция для поиска и объединения файлов"""
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        for target_dir in TARGET_DIRS:
            for root, _, files in os.walk(target_dir):
                for file in files:
                    # Проверка, нужный ли это файл
                    if any(target in file for target in TARGET_FILES):
                        file_path = os.path.join(root, file)
                        # Запись разделителя и содержимого файла
                        outfile.write(f"\n{'=' * 40}\n{file_path}\n{'=' * 40}\n")
                        with open(file_path, "r", encoding="utf-8") as infile:
                            outfile.write(infile.read())
                        outfile.write("\n")

    print(f"Файлы успешно объединены в {OUTPUT_FILE}")

if __name__ == "__main__":
    collect_files()
