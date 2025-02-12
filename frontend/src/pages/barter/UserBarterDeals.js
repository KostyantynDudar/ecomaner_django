import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserBarterDeals = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [priceDifference, setPriceDifference] = useState(0);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get("https://ecomaner.com/barter/api/user-deals/", {
                    headers: {
                        "Authorization": `Token ${token}`,
                        "X-CSRFToken": getCookie("csrftoken"),
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
                            <tr key={deal.id}>
                                <td>{deal.item_A?.title || "Не указано"}</td>
                                <td>{deal.item_B?.title || "Не указано"}</td>
                                <td>{deal.status}</td>
                                <td>
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/barter/deal-room/${deal.id}`);
                                    }}>
                                        Открыть сделку
                                    </button>
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
