import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DealRoom = () => {
    const { id } = useParams(); // ✅ Получаем ID сделки из URL
    const [deal, setDeal] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("🔍 ID сделки из useParams:", id); // ✅ Проверяем, что ID передается

        if (!id) {
            setError("Некорректный ID сделки.");
            setLoading(false);
            return;
        }

        const fetchDeal = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const response = await axios.get(`https://ecomaner.com/barter/api/deals/${id}/`, {
                    headers: {
                        "Authorization": `Token ${token}`,
                    },
                    withCredentials: true,
                });

                console.log("✅ Данные сделки:", response.data);
                setDeal(response.data);
            } catch (err) {
                setError("Ошибка загрузки сделки.");
                console.error("❌ Ошибка API:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeal();
    }, [id]); // ✅ Теперь useEffect зависит от `id`

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h1>Комната сделки #{deal.id}</h1>
            <p><strong>Товар A:</strong> {deal.item_A?.title || "Не указано"}</p>
            <p><strong>Товар B:</strong> {deal.item_B?.title || "Не указано"}</p>
            <p><strong>Статус:</strong> {deal.status}</p>
        </div>
    );
};

export default DealRoom;
