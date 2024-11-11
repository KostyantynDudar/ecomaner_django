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

    // Инициализация карты
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

    // Добавление маркеров на карту
    useEffect(() => {
        if (map && locations.length > 0) {
            console.log("Начинаем добавление маркеров на карту...");
            locations.forEach((location, index) => {
                const lat = parseFloat(location.latitude);
                const lng = parseFloat(location.longitude);

                if (!isNaN(lat) && !isNaN(lng)) {
                    console.log(`Добавляем маркер для локации с индексом ${index}: широта ${lat}, долгота ${lng}`);
                    
                    const popupContent = `
                        <div>
                            <b>${location.type || 'Тип не указан'}</b><br>
                            ${location.description || 'Описание не указано'}
                            <div style="margin-top: 8px;">
                                <button onclick="window.handleVote('${location.id}', 'like')">👍 Лайк</button>
                                <button onclick="window.handleVote('${location.id}', 'dislike')">👎 Дизлайк</button>
                            </div>
                            <textarea id="comment_${location.id}" placeholder="Оставьте комментарий"></textarea>
                            <button onclick="window.handleComment('${location.id}')">Отправить комментарий</button>
                        </div>
                    `;

                    const marker = L.marker([lat, lng])
                        .addTo(map)
                        .bindPopup(popupContent);

                    marker.on('click', () => {
                        console.log(`Маркер для локации с ID ${location.id} нажат`);
                    });
                } else {
                    console.warn(`Некорректные координаты для локации с индексом ${index}:`, location);
                }
            });
        }
    }, [map, locations]);

    // Глобальная функция для обработки голосования
    window.handleVote = (locationId, type) => {
        console.log(`Голос: ${type} для локации с ID ${locationId}`);
        // Добавьте код для отправки голосов на сервер
    };

    // Глобальная функция для отправки комментариев
    window.handleComment = (locationId) => {
        const comment = document.getElementById(`comment_${locationId}`).value;
        if (comment) {
            console.log(`Комментарий для локации с ID ${locationId}: ${comment}`);
            // Добавьте код для отправки комментариев на сервер
        } else {
            alert('Комментарий не может быть пустым');
        }
    };

    return <div id="map" style={{ height: '600px', width: '100%' }} />;
};

export default Map;
