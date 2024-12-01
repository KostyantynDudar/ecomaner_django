import React, { useEffect, useState } from 'react';

const NewsList = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        console.log('Запрос к API отправляется');
        fetch('/api/news/')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Ответ от API:', data);  // Вывод ответа от сервера
                setNews(data);
            })
            .catch(error => console.error("Ошибка при запросе API:", error));
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
