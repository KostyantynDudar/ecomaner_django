// /home/ecomaner_django/frontend/src/pages/barter/UserBarterRequests.js

import React, { useState, useEffect } from "react";

const UserBarterRequests = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        console.log("🔍 useEffect запущен. Отправляем запрос к API...");
        
        fetch("/barter/api/user-requests/", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`  // Используем токен пользователя
            }
        })
        .then(response => {
            console.log("📡 Ответ от API получен", response);
            return response.json();
        })
        .then(data => {
            console.log("📌 Полученные данные от API:", data);
            if (!Array.isArray(data)) {
                console.error("⚠️ API не вернул массив, возможно ошибка!", data);
                setRequests([]);
            } else if (data.length === 0) {
                console.warn("⚠️ API вернул пустой список. Используем заглушку.");
                setRequests([
                    {
                        id: 1,
                        title: "Тестовая заявка",
                        description: "Пока тут пусто, но скоро появятся реальные обмены!"
                    }
                ]);
            } else {
                setRequests(data);
            }
        })
        .catch(error => console.error("❌ Ошибка загрузки заявок:", error));
    }, []);

    return (
        <div>
            <h2>Мои заявки</h2>
            <ul>
                {requests.map((req) => (
                    <li key={req.id}>
                        <strong>{req.title}</strong> - {req.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserBarterRequests;
