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
                    withCredentials: true,
                });
                setDeals(response.data);
            } catch (err) {
                setError("Ошибка загрузки сделок.");
                console.error("Ошибка API:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDeals();
    }, []);

    const handleConfirmDeal = async (dealId) => {
        try {
            await axios.put(`https://ecomaner.com/barter/api/deals/${dealId}/confirm/`, {}, {
                withCredentials: true,
            });
            alert("Сделка подтверждена!");
            setDeals(deals.map(deal => 
                deal.id === dealId ? { ...deal, status: "active", partner: true } : deal
            ));
        } catch (error) {
            alert("Ошибка подтверждения сделки.");
            console.error("Ошибка API:", error);
        }
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h2>Мои сделки</h2>
            {deals.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Товар A</th>
                            <th>Товар B</th>
                            <th>Статус</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deals.map((deal) => (
                            <tr key={deal.id}>
                                <td>{deal.item_A ? deal.item_A.title : "Не указано"}</td>
                                <td>{deal.item_B ? deal.item_B.title : "Не указано"}</td>
                                <td>{deal.status}</td>
                                <td>
                                    {deal.status === "pending" && !deal.partner && (
                                        <button onClick={() => handleConfirmDeal(deal.id)}>
                                            Подтвердить сделку
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>У вас пока нет сделок.</p>
            )}
        </div>
    );
};

export default UserBarterDeals;
