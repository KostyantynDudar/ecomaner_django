//  /home/ecomaner_django/frontend/src/pages/barter/CreateBarterRequest.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateBarterRequest = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("https://ecomaner.com/barter/api/user-requests/", {
                title,
                description,
            }, { withCredentials: true });

            navigate("/barter");  // После создания заявки вернуть в кабинет
        } catch (err) {
            setError("Ошибка при создании заявки. Попробуйте снова.");
            console.error("API error:", err);
        }
    };

    return (
        <div>
            <h1>Создать новую заявку</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Название:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label>Описание:</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

                <button type="submit">Создать заявку</button>
            </form>
        </div>
    );
};

export default CreateBarterRequest;
