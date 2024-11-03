import os

def save_project_to_text(output_file='project_files.txt'):
    with open(output_file, 'w', encoding='utf-8') as f_out:
        # Проходим по всем файлам в текущей директории и поддиректориях
        for root, dirs, files in os.walk('.'):
            for file_name in files:
                # Полный путь к файлу
                file_path = os.path.join(root, file_name)
                f_out.write(f"=== File: {file_path} ===\n")  # Заголовок с названием файла и путём

                try:
                    with open(file_path, 'r', encoding='utf-8') as f_in:
                        content = f_in.read()  # Содержимое файла
                        f_out.write(content + "\n")  # Записываем содержимое файла
                except Exception as e:
                    f_out.write(f"Ошибка при чтении файла: {e}\n")

                f_out.write("\n\n")  # Разделитель между файлами

    print(f"Проект сохранён в {output_file}")

# Запускаем функцию
save_project_to_text()

