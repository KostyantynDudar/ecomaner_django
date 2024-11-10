// Map.js
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';

const Map = () => {
    const [locations, setLocations] = useState([]);
    const [map, setMap] = useState(null);

    // Функция загрузки данных о локациях
    useEffect(() => {
        async function loadLocations() {
            console.log('Загрузка данных о локациях с API...');
            const apiUrl = 'https://ecomaner.com/api/map/locations/';

            try {
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Полные данные, полученные от API:', data);

                if (Array.isArray(data)) {
                    console.log(`Получен массив из ${data.length} локаций.`);
                    data.forEach((location, index) => {
                        console.log(`Локация ${index + 1}: широта ${location.latitude}, долгота ${location.longitude}`);
                    });
                    setLocations(data);
                } else {
                    console.error("Ожидался массив данных от API, но получен другой формат:", data);
                }
            } catch (error) {
                console.error('Ошибка загрузки данных о локациях:', error);
            }
        }

        loadLocations();
    }, []);

    // Инициализация карты (только один раз при монтировании компонента)
    useEffect(() => {
        if (!map) {
            const newMap = L.map('map').setView([50.27, 30.31], 10);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(newMap);

            console.log("Карта создана");
            setMap(newMap);
        }
    }, [map]);

    // Добавление маркеров на карту при изменении данных о локациях
    useEffect(() => {
        if (map && locations.length > 0) {
            console.log("Начинаем добавление маркеров на карту...");
            locations.forEach((location, index) => {
                const lat = parseFloat(location.latitude);
                const lng = parseFloat(location.longitude);

                if (!isNaN(lat) && !isNaN(lng)) {
                    console.log(`Добавляем маркер для локации с индексом ${index}: широта ${lat}, долгота ${lng}`);
                    
                    // Настройка кастомной иконки
                    const customIcon = L.icon({
                        // iconUrl: 'https://example.com/path/to/custom-icon.png', // замените URL на свою картинку
                        iconSize: [32, 32], // размер иконки
                        iconAnchor: [16, 32], // точка якоря
                        popupAnchor: [0, -32] // точка появления попапа
                    });

                    // Добавление маркера с кастомной иконкой
                    L.marker([lat, lng], { icon: customIcon })
                        .addTo(map)
                        .bindPopup(`<b>${location.type || 'Тип не указан'}</b><br>${location.description || 'Описание не указано'}`);
                } else {
                    console.warn(`Некорректные координаты для локации с индексом ${index}:`, location);
                }
            });
        } else {
            console.log("Маркер не добавлен: либо карта еще не загружена, либо массив локаций пустой.");
        }
    }, [map, locations]);

    return <div id="map" style={{ height: '600px', width: '100%' }} />;
};

export default Map;
