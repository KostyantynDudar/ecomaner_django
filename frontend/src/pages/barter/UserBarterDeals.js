import React, { useState, useEffect } from "react";
import axios from "axios";

const UserBarterDeals = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const response = await axios.get("https://ecomaner.com/barter/api/user-deals/", {
                    withCredentials: true, // Если нужен cookie-based auth
                });
                setDeals(response.data);
            } catch (err) {
                setError("Ошибка загрузки данных обменов.");
                console.error("Ошибка API:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Мои обмены</h2>
            {deals.length > 0 ? (
                <ul>
                    {deals.map((deal) => (
                        <li key={deal.id}>
                            <strong>{deal.item}</strong> - {deal.status}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>У вас пока нет обменов.</p>
            )}
        </div>
    );
};

export default UserBarterDeals;
