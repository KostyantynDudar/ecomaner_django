import React from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";
import UserBarterRequests from "./UserBarterRequests";
import UserBarterDeals from "./UserBarterDeals";

const AccountPage = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h1>Личный кабинет бартера</h1>
            <UserProfile />
            <UserBarterRequests />
            <UserBarterDeals />
            
            <div style={{ marginTop: "20px" }}>
                <button onClick={() => navigate("/barter/create-request")}>
                    ➕ Создать заявку
                </button>
                <button onClick={() => navigate("/barter/all-requests")} style={{ marginLeft: "10px" }}>
                    🔍 Посмотреть заявки
                </button>
            </div>
        </div>
    );
};

export default AccountPage;
