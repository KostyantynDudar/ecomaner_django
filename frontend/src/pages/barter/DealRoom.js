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
            <p><strong>Товар A:</strong> {deal.item_A ? deal.item_A.title : "Не указано"}</p>
            <p><strong>Товар B:</strong> {deal.item_B ? deal.item_B.title : "Не указано"}</p>
            <p><strong>Статус:</strong> {deal.status}</p>
            
            {deal.status === "pending" && (
                <>
                    <button onClick={handleConfirmDeal} disabled={isProcessing}>Подтвердить сделку</button>
                    <button onClick={handleCancelDeal} disabled={isProcessing}>Отменить сделку</button>
                </>
            )}

            <div className="chat-container">
                <h2>Чат сделки</h2>
                <div className="chat-messages">
                    {chatMessages.map((msg, index) => (
                        <p key={index}><strong>{msg.sender}:</strong> {msg.text}</p>
                    ))}
                </div>
                <div className="chat-input">
                    <input 
                        type="text" 
                        value={newMessage} 
                        onChange={(e) => setNewMessage(e.target.value)} 
                        placeholder="Написать сообщение..."
                    />
                    <button onClick={handleSendMessage}>Отправить</button>
                </div>
            </div>

            <div className="navigation-buttons">
                <button onClick={() => navigate("/barter/all-requests")} className="nav-button">Список заявок</button>
                <button onClick={() => navigate("/barter")} className="nav-button">Личный кабинет</button>
            </div>
        </div>
    );
};

export default DealRoom;
