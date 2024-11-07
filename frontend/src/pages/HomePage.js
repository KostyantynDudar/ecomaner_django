// src/pages/HomePage.js
import React, { useEffect, useState } from 'react';

const HomePage = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('https://ecomaner.com/api/main/home/')  // Запрос к API Django
            .then(response => response.json())
            .then(data => setMessage(data.message))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return (
        <div>
            <h1>{message}</h1>
        </div>
    );
};

export default HomePage;
