import React, { useState, useEffect } from "react";
import axios from "axios";
import BarterMenu from "../../components/BarterMenu";
import "../../styles/BarterTable.css";

const AllBarterRequests = () => {
    const [requests, setRequests] = useState([]);
    const [userItems, setUserItems] = useState([]); // 🔹 Храним товары инициатора
    const [selectedItem, setSelectedItem] = useState(""); // 🔹 Выбранный товар
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [dealTarget, setDealTarget] = useState(null); // 🔹 Данные заявки для сделки

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
                const filteredRequests = response.data.filter(req => !req.is_reserved);  // ✅ Оставляем только доступные товары
                setRequests(filteredRequests);
            } catch (err) {
                setError("Ошибка загрузки заявок.");
                console.error("API error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    // 🔹 Получаем товары текущего пользователя
    const fetchUserItems = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const response = await axios.get("https://ecomaner.com/barter/api/user-requests/", {
                headers: { "Authorization": `Token ${token}` },
                withCredentials: true,
            });
            setUserItems(response.data);
        } catch (err) {
            console.error("Ошибка загрузки товаров:", err);
        }
    };

    const getCSRFToken = () => {
        return document.cookie
            .split("; ")
            .find(row => row.startsWith("csrftoken="))
            ?.split("=")[1] || "";
    };

    // 🔹 Открываем меню выбора товара
    const openDealMenu = async (requestId, requestTitle, partnerEmail) => {
        setDealTarget({ requestId, requestTitle, partnerEmail });
        await fetchUserItems(); // Загружаем товары пользователя
    };

    // 🔹 Создаем сделку с выбранным товаром
    const handleCreateDeal = async () => {
        if (!selectedItem) {
            alert("Выберите ваш товар для обмена!");
            return;
        }
        setIsProcessing(true);

        try {
            const csrftoken = getCSRFToken();
            const token = localStorage.getItem("authToken");
  
            console.log("📌 Создание сделки:", {
            item_A: selectedItem,
            item_B: dealTarget.requestId,
            partner_email: dealTarget.partnerEmail
            });


            const response = await axios.post(
                "https://ecomaner.com/barter/api/deals/create/",
                {
                    item_A: selectedItem,  
                    item_B: dealTarget.requestId,   
                    compensation_points: 0,
                    partner_email: dealTarget.partnerEmail
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
            setDealTarget(null); // Закрываем меню
            window.location.href = `/barter/deal-room/${response.data.id}`;

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
                                            onClick={() => openDealMenu(req.id, req.title, req.owner)}
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

            {/* 🔹 Меню выбора товара для обмена */}
            {dealTarget && (
                <div className="deal-popup">
                    <h3>Выберите ваш товар для обмена на "{dealTarget.requestTitle}"</h3>
                    <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
                        <option value="">-- Выберите товар --</option>
                        {userItems.map((item) => (
                            <option key={item.id} value={item.id}>{item.title}</option>
                        ))}
                    </select>
                    <button onClick={handleCreateDeal} disabled={isProcessing}>Подтвердить сделку</button>
                    <button onClick={() => setDealTarget(null)}>Отмена</button>
                </div>
            )}
        </div>
    );
};

export default AllBarterRequests;
