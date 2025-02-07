import React from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "./UserProfile";
import UserBarterRequests from "./UserBarterRequests";
import UserBarterDeals from "./UserBarterDeals";
import BarterMenu from '../../components/BarterMenu';
import "../../styles/BarterProfile.css";

const AccountPage = () => {
    const navigate = useNavigate();

    return (
        <>
            <BarterMenu />
            <div className="barter-account-container">
                <div className="barter-buttons top-buttons">
                    <button onClick={() => navigate("/barter/create-request")} className="barter-btn">
                        ➕ Создать заявку
                    </button>
                    <button onClick={() => navigate("/barter/all-requests")} className="barter-btn">
                        🔍 Посмотреть заявки
                    </button>
                </div>
                <div className="barter-section">
                    <UserProfile />
                </div>
                <div className="barter-section">
                    <h2>Мои заявки</h2>
                    <UserBarterRequests />
                </div>
                <div className="barter-section">
                    <h2>Мои обмены</h2>
                    <UserBarterDeals />
                </div>
            </div>
        </>
    );
};

export default AccountPage;
