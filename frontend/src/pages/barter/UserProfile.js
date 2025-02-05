import React from "react";

const UserProfile = () => {
    // Заглушка, данные потом будем получать через API
    const user = {
        name: "Иван Иванов",
        email: "ivan@example.com"
    };

    return (
        <div>
            <h2>Профиль</h2>
            <p><strong>Имя:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <button>Редактировать профиль</button>
        </div>
    );
};

export default UserProfile;
