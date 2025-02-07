import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BarterMenu from '../../components/BarterMenu';

const CreateBarterRequest = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("exchange");
    const [address, setAddress] = useState("");
    const [value, setValue] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Функция для получения CSRF-токена из куков
    const getCSRFToken = () => {
        const match = document.cookie.match(/csrftoken=([^;]+)/);
        return match ? match[1] : null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        const csrfToken = getCSRFToken();
        if (!csrfToken) {
            setError("Ошибка: CSRF-токен отсутствует. Попробуйте снова.");
            return;
        }

        try {
            const response = await axios.post(
                "https://ecomaner.com/barter/api/user-requests/",
                { title, description, category, address, value },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfToken,  // ✅ Передаем CSRF-токен
                    }
                }
            );

            setSuccess(true);
            console.log("✅ Заявка успешно создана:", response.data);
            setTimeout(() => navigate("/barter"), 2000);
        } catch (err) {
            if (err.response && err.response.status === 403) {
                setError("Ошибка: Доступ запрещен. Проверьте авторизацию.");
            } else {
                setError("Ошибка при создании заявки. Попробуйте снова.");
            }
            console.error("API error:", err);
        }
    };

    return (
        <>
            <BarterMenu />
            <div style={{ maxWidth: "500px", margin: "auto", padding: "20px", backgroundColor: "#222", color: "#fff", borderRadius: "10px" }}>
                <h1 style={{ textAlign: "center" }}>Создать новую заявку</h1>
                {success && <p style={{ color: "green", textAlign: "center" }}>✅ Заявка успешно создана!</p>}
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <label>Название:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={inputStyle} />

                    <label>Описание:</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} required style={textareaStyle} />

                    <label>Тип заявки:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                        <option value="exchange">Обмен</option>
                        <option value="search">Поиск</option>
                        <option value="gift">Дар</option>
                    </select>

                    <label>Адрес:</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required style={inputStyle} />

                    <label>Оценка в баллах:</label>
                    <input type="number" min="0" value={value} onChange={(e) => setValue(e.target.value)} required style={inputStyle} />

                    <button type="submit" style={buttonStyle}>Создать заявку</button>
                </form>
            </div>
        </>
    );
};

const inputStyle = {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
    backgroundColor: "#333",
    color: "#fff"
};

const textareaStyle = {
    ...inputStyle,
    height: "80px",
    resize: "none"
};

const buttonStyle = {
    padding: "10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px"
};

export default CreateBarterRequest;
