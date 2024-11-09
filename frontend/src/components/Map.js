import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/Map.css';

const Map = () => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        // Получаем данные о локациях с API
        fetch('/api/locations/')
            .then(response => response.json())
            .then(data => {
                console.log("Данные локаций:", data);  // Лог для проверки данных
                setLocations(data);
            })
            .catch(error => console.error('Ошибка загрузки данных:', error));
    }, []);

 useEffect(() => {
    if (!L.DomUtil.get('map')._leaflet_id) { 
        const map = L.map('map').setView([50.27, 30.31], 10);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(map);

        console.log("Карта создана");

        locations.forEach(location => {
            console.log("Добавляем маркер для:", location);
            L.marker([location.latitude, location.longitude])
                .addTo(map)
                .bindPopup(`<b>${location.type}</b><br>${location.description}`);
        });
    }
}, [locations]);


    return <div id="map" style={{ height: '600px', width: '100%' }} />;
};

export default Map;
