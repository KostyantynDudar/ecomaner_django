// Map.js
import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';

const Map = () => {
    const [locations, setLocations] = useState([]);
    const [map, setMap] = useState(null); // Сохраняем экземпляр карты в состоянии

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
                    setLocations(data); // Сохраняем локации в состоянии
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
            setMap(newMap); // Сохраняем экземпляр карты в состоянии
        }
    }, [map]);

    // Добавление маркеров на карту при изменении данных о локациях
    useEffect(() => {
        if (map && locations.length > 0) {
            locations.forEach((location, index) => {
                const lat = parseFloat(location.latitude);
                const lng = parseFloat(location.longitude);

                if (!isNaN(lat) && !isNaN(lng)) {
                    console.log(`Добавляем маркер для локации с индексом ${index}: широта ${lat}, долгота ${lng}`);
                    L.marker([lat, lng])
                        .addTo(map)
                        .bindPopup(`<b>${location.type}</b><br>${location.description}`);
                } else {
                    console.warn(`Некорректные координаты для локации с индексом ${index}:`, location);
                }
            });
        }
    }, [map, locations]); // Этот эффект сработает каждый раз, когда изменится `locations` или `map`

    return <div id="map" style={{ height: '600px', width: '100%' }} />;
};

export default Map;
