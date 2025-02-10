import React, { useState, useEffect } from "react";
import axios from "axios";
import BarterMenu from "../../components/BarterMenu";
import "../../styles/BarterTable.css";

const AllBarterRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const userResponse = await axios.get("https://ecomaner.com/api/accounts/profile/", {
                    headers: { "Authorization": `Token ${token}` },
                    withCredentials: true,
                });

                console.log("Данные профиля:", userResponse.data);
                setCurrentUser(userResponse.data.id);

                const response = await axios.get("https://ecomaner.com/barter/api/all-requests/");
                console.log("📌 API Response:", response.data);
                setRequests(response.data);
            } catch (err) {
                setError("Ошибка загрузки заявок.");
                console.error("API error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const getCSRFToken = () => {
        const match = document.cookie.match(/csrftoken=([^;]+)/);
        return match ? match[1] : "";
    };

    const handleCreateDeal = async (requestId) => {
        if (isProcessing) return;
        setIsProcessing(true);

        console.log("📌 Отправка запроса на создание сделки:", requestId);

        try {
            const csrftoken = getCSRFToken();
            const response = await axios.post(
                "https://ecomaner.com/barter/api/deals/create/",
                {
                    item_A: requestId,
                    item_B: null,
                    compensation_points: 0
                },
                {
                    withCredentials: true,
                    headers: { "X-CSRFToken": csrftoken }
                }
            );

            alert("Сделка успешно создана!");
            console.log("✅ Ответ API:", response.data);
        } catch (error) {
            alert("Ошибка создания сделки. Проверьте консоль.");
            console.error("❌ API error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <BarterMenu />
            <h1>Все заявки на бартер</h1>
            <table className="barter-table">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Описание</th>
                        <th>Тип</th>
                        <th>Адрес</th>
                        <th>Оценка</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.length > 0 ? (
                        requests.map((req) => (
                            <tr key={req.id}>
                                <td><strong>{req.title}</strong></td>
                                <td>{req.description}</td>
                                <td>{req.barter_type || "Не указан"}</td>
                                <td>{req.location || "Не указан"}</td>
                                <td>{req.estimated_value || "-"}</td>
                                <td>{req.status}</td>
                                <td>
                                    {console.log("Текущий пользователь:", currentUser, "Владелец заявки:", req.owner)}
                                    {true && (
                                    // {currentUser && req.owner !== currentUser && (
                                        <button
                                            className="barter-action-btn"
                                            onClick={() => handleCreateDeal(req.id)}
                                            disabled={isProcessing}
                                        >
                                            Открыть сделку
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">Заявок пока нет.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllBarterRequests;
