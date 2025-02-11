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
                setCurrentUser(userResponse.data.email);

                const response = await axios.get("https://ecomaner.com/barter/api/all-requests/");
                console.log("📌 Данные заявок:", response.data); // ЛОГ
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
        return document.cookie
            .split("; ")
            .find(row => row.startsWith("csrftoken="))
            ?.split("=")[1] || "";
    };

    const handleCreateDeal = async (requestId, partnerEmail) => {  // ✅ Исправлено
        if (isProcessing) return;
        setIsProcessing(true);

        console.log("📌 Отправка запроса на создание сделки:", requestId, "для", partnerEmail);

        try {
            const csrftoken = getCSRFToken();
            const token = localStorage.getItem("authToken");

            const response = await axios.post(
                "https://ecomaner.com/barter/api/deals/create/",
                {
                    item_A: requestId,
                    item_B: null,
                    compensation_points: 0,
                    partner_email: partnerEmail  // ✅ Передаем email владельца
                },
                {
                    withCredentials: true,
                    headers: {
                        "X-CSRFToken": csrftoken,
                        "Authorization": `Token ${token}`
                    }
                }
            );

            alert("Сделка успешно создана!");
            console.log("✅ Ответ API:", response.data);
        } catch (error) {
            alert("Ошибка создания сделки. Проверьте консоль.");
            console.error("❌ API error:", error.response?.data || error);
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
                                    {currentUser && req.owner !== currentUser && (
                                        <button
                                            className="barter-action-btn"
                                            onClick={() => handleCreateDeal(req.id, req.owner)}  // ✅ Исправлено
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
