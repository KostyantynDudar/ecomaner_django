#!/bin/bash

# Список имен файлов для шаблонов
template_files=(
    "home.html"
    "about.html"
    "how_it_works.html"
    "civilizations.html"
    "gameplay.html"
    "eternal_items.html"
    "research.html"
    "participation.html"
    "news.html"
    "faq.html"
    "contact.html"
    "store.html"
    "map.html"
)

# Создание пустых файлов
for filename in "${template_files[@]}"; do
    if [[ ! -f "$filename" ]]; then
        touch "$filename"
        echo "Created: $filename"
    else
        echo "File already exists: $filename"
    fi
done

