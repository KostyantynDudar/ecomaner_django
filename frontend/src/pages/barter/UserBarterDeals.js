import React, { useState, useEffect } from "react";

const UserBarterDeals = () => {
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        // Пока используем заглушку, позже заменим API-запросом
        setDeals([
            { id: 1, item: "Чайник", status: "Ожидание подтверждения" },
            { id: 2, item: "Ноутбук", status: "В процессе" }
        ]);
    }, []);

    return (
        <div>
            <h2>Мои обмены</h2>
            <ul>
                {deals.map((deal) => (
                    <li key={deal.id}>
                        <strong>{deal.item}</strong> - {deal.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserBarterDeals;
