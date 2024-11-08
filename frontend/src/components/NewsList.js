// src/components/NewsList.js

import React, { useEffect, useState } from 'react';

const NewsList = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetch('/news/api/news/')  // Убедитесь, что этот путь правильный
            .then(response => response.json())
            .then(data => setNews(data))
            .catch(error => console.error("Ошибка загрузки новостей:", error));
    }, []);

    return (
        <div>
            <h1>Новости</h1>
            {news.length === 0 ? (
                <p>Нет новостей</p>
            ) : (
                <ul>
                    {news.map(item => (
                        <li key={item.id}>
                            <h2>{item.title}</h2>
                            <p>{item.content}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NewsList;
