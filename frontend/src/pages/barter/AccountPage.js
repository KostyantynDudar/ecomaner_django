import React from "react";
import { useNavigate } from "react-router-dom"; // Добавляем навигацию
import UserProfile from "./UserProfile";
import UserBarterRequests from "./UserBarterRequests";
import UserBarterDeals from "./UserBarterDeals";

const AccountPage = () => {
    const navigate = useNavigate(); // Хук для перенаправления

    console.log("📌 Личный кабинет загружен.");

    return (
        <div>
            <h1>Личный кабинет бартера</h1>
            <UserProfile />
            <UserBarterRequests />
            <UserBarterDeals />

            {/* Кнопки для управления */}
            <div style={{ marginTop: "20px" }}>
                <button onClick={() => navigate("/barter/create-request")}>
                    Создать заявку
                </button>
                <button onClick={() => navigate("/barter/requests")} style={{ marginLeft: "10px" }}>
                    Посмотреть заявки других пользователей
                </button>
            </div>
        </div>
    );
};

export default AccountPage;
