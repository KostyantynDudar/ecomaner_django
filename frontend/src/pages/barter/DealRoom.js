// frontend/src/pages/barter/DealRoom.js - Комната сделки

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BarterMenu from "../../components/BarterMenu";
import "../../styles/DealRoom.css";

const DealRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deal, setDeal] = useState(null);
    const [itemA, setItemA] = useState(null);
    const [itemB, setItemB] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const fetchDeal = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(`https://ecomaner.com/barter/api/deals/${id}/`, {
                    headers: { "Authorization": `Token ${token}` },
                    withCredentials: true,
                });
                setDeal(response.data);

                // Загружаем данные товаров
                const itemAResponse = await axios.get(`https://ecomaner.com/barter/api/user-requests/${response.data.item_A}/`);
                setItemA(itemAResponse.data);
                
                if (response.data.item_B) {
                    const itemBResponse = await axios.get(`https://ecomaner.com/barter/api/user-requests/${response.data.item_B}/`);
                    setItemB(itemBResponse.data);
                }
            } catch (err) {
                setError("Ошибка загрузки сделки.");
                console.error("API error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDeal();
    }, [id]);

    const handleConfirmDeal = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            const token = localStorage.getItem("authToken");
            await axios.put(`https://ecomaner.com/barter/api/deals/${id}/confirm/`, {}, {
                headers: { "Authorization": `Token ${token}` },
                withCredentials: true,
            });
            alert("Сделка подтверждена!");
            setDeal(prev => ({ ...prev, status: "active" }));
        } catch (error) {
            alert("Ошибка подтверждения сделки. Проверьте консоль.");
            console.error("API error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancelDeal = async () => {
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`https://ecomaner.com/barter/api/deals/${id}/`, {
                headers: { "Authorization": `Token ${token}` },
                withCredentials: true,
            });
            alert("Сделка отменена!");
            navigate("/barter/all-requests");
        } catch (error) {
            alert("Ошибка отмены сделки. Проверьте консоль.");
            console.error("API error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        setChatMessages(prev => [...prev, { text: newMessage, sender: "Вы" }]);
        setNewMessage("");

        try {
            const token = localStorage.getItem("authToken");
            await axios.post(`https://ecomaner.com/barter/api/deals/${id}/chat/`, 
                { message: newMessage }, 
                { headers: { "Authorization": `Token ${token}` }, withCredentials: true }
            );
        } catch (error) {
            console.error("Ошибка отправки сообщения:", error);
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="deal-room">
            <BarterMenu />
            <h1>Комната сделки #{deal.id}</h1>
            <div className="deal-items">
                <div className="deal-item">
                    <h2>Товар A</h2>
                    {itemA ? (
                        <>
                            {itemA.image && <img src={itemA.image} alt={itemA.title} />}
                            <p><strong>{itemA.title}</strong></p>
                            <p>Цена: {itemA.estimated_value} баллов</p>
                        </>
                    ) : (
                        <p>Загрузка...</p>
                    )}
                </div>
                {itemB && (
                    <div className="deal-item">
                        <h2>Товар B</h2>
                        {itemB ? (
                            <>
                                {itemB.image && <img src={itemB.image} alt={itemB.title} />}
                                <p><strong>{itemB.title}</strong></p>
                                <p>Цена: {itemB.estimated_value} баллов</p>
                            </>
                        ) : (
                            <p>Загрузка...</p>
                        )}
                    </div>
                )}
            </div>
            
            {deal.status === "pending" && (
                <>
                    <button onClick={() => handleConfirmDeal()} disabled={isProcessing}>Подтвердить сделку</button>
                    <button onClick={() => handleCancelDeal()} disabled={isProcessing}>Отменить сделку</button>
                </>
            )}
        </div>
    );
};

export default DealRoom;
