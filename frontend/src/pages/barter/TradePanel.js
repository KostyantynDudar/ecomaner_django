import React, { useState, useEffect } from "react";
import axios from "axios";

const TradePanel = ({ dealId, itemA, itemB, userBalance }) => {
    const [offerA, setOfferA] = useState(itemA?.estimated_value || 0);
    const [offerB, setOfferB] = useState(itemB?.estimated_value || 0);
    const [priceDifference, setPriceDifference] = useState(0);
    const [canAccept, setCanAccept] = useState(false);

    useEffect(() => {
        if (offerA !== null && offerB !== null) {
            const diff = Math.abs(offerA - offerB);
            setPriceDifference(diff);
            setCanAccept(offerA === offerB || userBalance >= diff);
        }
    }, [offerA, offerB, userBalance]);

    const handleAcceptDeal = async () => {
        try {
            const token = localStorage.getItem("authToken");
            await axios.post(`https://ecomaner.com/barter/api/deals/${dealId}/accept/`, {}, {
                headers: { "Authorization": `Token ${token}` },
            });
            alert("Сделка принята!");
        } catch (error) {
            console.error("Ошибка принятия сделки:", error);
            alert("Не удалось принять сделку.");
        }
    };

    return (
        <div className="trade-panel">
            <h3>Торги</h3>
            <p>Разница в стоимости: <strong>{priceDifference} баллов</strong></p>
            <button onClick={() => setOfferA(offerA + 10)}>Увеличить цену Товара A</button>
            <button onClick={() => setOfferB(offerB - 10)}>Уменьшить цену Товара B</button>
            {userBalance >= priceDifference && (
                <button onClick={() => setPriceDifference(0)}>Доплатить {priceDifference} баллов</button>
            )}
            {canAccept && (
                <button onClick={handleAcceptDeal} className="accept-button">
                    Принять сделку
                </button>
            )}
        </div>
    );
};

export default TradePanel;
