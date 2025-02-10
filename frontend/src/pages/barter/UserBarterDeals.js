import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserBarterDeals = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get("https://ecomaner.com/barter/api/user-deals/", {
                    headers: {
                        "Authorization": `Token ${token}`,
                        "X-CSRFToken": getCookie("csrftoken")  // Добавляем CSRF
                    },
                    withCredentials: true,
                });
                setDeals(response.data);
            } catch (err) {
                setError("Ошибка загрузки сделок.");
                console.error("Ошибка API:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    const handleConfirmDeal = async (dealId) => {
        try {
            const token = localStorage.getItem("authToken");
            const csrfToken = getCookie("csrftoken");

            await axios.put(
                `https://ecomaner.com/barter/api/deals/${dealId}/confirm/`,
                {},
                {
                    headers: {
                        "Authorization": `Token ${token}`,
                        "X-CSRFToken": csrfToken  // Отправляем CSRF
                    },
                    withCredentials: true,
                }
            );

            alert("Сделка подтверждена!");
            setDeals(deals.map(deal =>
                deal.id === dealId ? { ...deal, status: "active", partner: true } : deal
            ));
        } catch (error) {
            alert("Ошибка подтверждения сделки.");
            console.error("Ошибка API:", error);
        }
    };

    // Функция для получения CSRF из cookies
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + "=")) {
                    cookieValue = cookie.substring(name.length + 1);
                    break;
                }
            }
        }
        return cookieValue;
    }

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Мои сделки</h2>
            {deals.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Товар A</th>
                            <th>Товар B</th>
                            <th>Статус</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deals.map((deal) => (
                            <tr key={deal.id} onClick={() => navigate(`/barter/deal/${deal.id}/`)}>
                                <td>{deal.item_A ? deal.item_A.title : "Не указано"}</td>
                                <td>{deal.item_B ? deal.item_B.title : "Не указано"}</td>
                                <td>{deal.status}</td>
                                <td>
                                    {deal.status === "pending" && !deal.partner && (
                                        <button onClick={(e) => {
                                            e.stopPropagation(); // Останавливаем всплытие события
                                            handleConfirmDeal(deal.id);
                                        }}>
                                            Подтвердить сделку
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>У вас пока нет сделок.</p>
            )}
        </div>
    );
};

export default UserBarterDeals;
