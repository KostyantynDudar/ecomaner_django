import React, { useState, useEffect } from "react";

const UserBarterRequests = () => {
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        fetch("/api/user-requests/", {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`  // Используем токен пользователя
            }
        })
        .then(response => response.json())
        .then(data => setRequests(data))
        .catch(error => console.error("Ошибка загрузки заявок:", error));
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
