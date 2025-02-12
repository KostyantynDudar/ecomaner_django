import React, { useState, useEffect } from "react";
import axios from "axios";

const ChatBox = ({ dealId }) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    useEffect(() => {
        const fetchChatMessages = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(`https://ecomaner.com/barter/api/deals/${dealId}/chat/`, {
                    headers: { "Authorization": `Token ${token}` },
                    withCredentials: true,
                });
                setChatMessages(response.data);
            } catch (error) {
                console.error("Ошибка загрузки чата:", error);
            }
        };

        fetchChatMessages();
        const interval = setInterval(fetchChatMessages, 5000);
        return () => clearInterval(interval);
    }, [dealId]);

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(`https://ecomaner.com/barter/api/deals/${dealId}/chat/`, 
                { message: newMessage }, 
                { headers: { "Authorization": `Token ${token}` }, withCredentials: true }
            );
            setNewMessage("");
        } catch (error) {
            console.error("Ошибка отправки сообщения:", error);
        }
    };

    return (
        <div className="chat-box">
            <h2>Чат сделки</h2>
            <div className="chat-messages">
                {chatMessages.length > 0 ? (
                    chatMessages.map((msg, index) => (
                        <p key={index}><strong>{msg.sender}:</strong> {msg.text}</p>
                    ))
                ) : (
                    <p>Сообщений пока нет</p>
                )}
            </div>
            <div className="chat-input">
                <input 
                    type="text" 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Введите сообщение..." 
                />
                <button onClick={handleSendMessage}>Отправить</button>
            </div>
        </div>
    );
};

export default ChatBox;
