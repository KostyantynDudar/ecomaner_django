// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';

const HomePage = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log("HomePage useEffect запущен");
        fetch('https://ecomaner.com/api/main/home/')  // Запрос к API Django
            .then(response => response.json())
            .then(data => {
                console.log("Получено сообщение:", data.message);
                setMessage(data.message);
            })
            .catch(error => console.error("Ошибка при получении данных:", error));
    }, []);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
};

export default HomePage;
