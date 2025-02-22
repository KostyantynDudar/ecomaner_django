import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Cookies from "js-cookie";  // ✅ Установи библиотеку: npm install js-cookie
import "../../styles/TradePanel.css";  // если стили в том же каталоге


    const TradePanel = ({ dealId, itemA, itemB, setItemA, setItemB, userBalance, reservedBalance, userEmail, ownerAEmail, ownerBEmail }) => {

    const [offerA, setOfferA] = useState(itemA?.estimated_value || 0);
    const [offerB, setOfferB] = useState(itemB?.estimated_value || 0);
    const [priceDifference, setPriceDifference] = useState(0);
    const [canAccept, setCanAccept] = useState(false);
    const socketRef = useRef(null);
    const [dealStatus, setDealStatus] = useState(null);
    const [initiatorReceived, setInitiatorReceived] = useState(false);
    const [partnerReceived, setPartnerReceived] = useState(false);


    console.log("🔥 TradePanel полученные пропсы:", { dealId, itemA, itemB, userEmail, ownerAEmail, ownerBEmail });


    // ✅ Фикс: следим за itemA и itemB
    useEffect(() => {
        if (itemA) setOfferA(itemA.estimated_value);
        if (itemB) setOfferB(itemB.estimated_value);
    }, [itemA, itemB]);



useEffect(() => {
    if (!dealId) {
        console.error("❌ Ошибка: dealId не определен! WebSocket не будет инициализирован.");
        return;
    }

    const connectWebSocket = () => {
        console.log("🟡 Инициализация WebSocket...");
        socketRef.current = new WebSocket(`wss://ecomaner.com/ws/barter/deal/${dealId}/`);

        socketRef.current.onopen = () => console.log("✅ WebSocket соединение установлено!");

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("📥 Получены данные через WebSocket:", data);

            if (data.type === "update") {
                setOfferA(parseFloat(data.offerA));
                setOfferB(parseFloat(data.offerB));
                setPriceDifference(parseFloat(data.priceDifference));

                // ✅ Обновляем itemA и itemB, чтобы изменения отразились в DealRoom
                setItemA(prev => prev ? { ...prev, estimated_value: parseFloat(data.offerA) } : prev);
                setItemB(prev => prev ? { ...prev, estimated_value: parseFloat(data.offerB) } : prev);
            }
        };

        socketRef.current.onclose = () => {
            console.log("❌ WebSocket соединение закрыто. Попытка переподключения через 3 сек...");
            setTimeout(() => {
                if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
                    connectWebSocket();
                }
            }, 3000);
        };
    };

    connectWebSocket(); // Первая инициализация WebSocket

    return () => {
        if (socketRef.current) {
            console.log("🔴 Закрываем WebSocket перед размонтированием.");
            socketRef.current.close();
        }
    };
}, [dealId]);



useEffect(() => {
    window.reactState = { offerA, offerB, priceDifference, canAccept }; 
    console.log("🔄 Обновленный стейт:", { offerA, offerB, priceDifference, canAccept });

    const diff = parseFloat(Math.abs(offerA - offerB).toFixed(2));
    
    // ✅ Правильное обновление состояния разницы
    setPriceDifference(diff);

    const newCanAccept = offerA === offerB && offerA > 0;

    console.log("🔍 Проверка canAccept:", { offerA, offerB, priceDifference: diff, newCanAccept });

    // ✅ Принудительное обновление `canAccept`
    setTimeout(() => setCanAccept(newCanAccept), 0);
}, [offerA, offerB]);




    const sendUpdate = (newOfferA, newOfferB) => {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            console.error("❌ WebSocket не готов к отправке, состояние:", socketRef.current?.readyState);
            return;
        }
        socketRef.current.send(JSON.stringify({
            action: "update_price",
            offerA: newOfferA,
            offerB: newOfferB,
            priceDifference: Math.abs(newOfferA - newOfferB),
        }));
    };


const handleIncrease = () => {
    console.log("🔼 Увеличение цены: userEmail =", userEmail, "ownerAEmail =", ownerAEmail, "ownerBEmail =", ownerBEmail);
    
    if (userEmail === ownerAEmail) {
        setOfferA((prev) => {
            console.log("🔼 handleIncrease -> Текущее значение offerA (до):", prev);
            const prevValue = Number(prev) || 0;
            const newValue = Number((prevValue + 10).toFixed(2));
            console.log("✅ handleIncrease -> Новое значение offerA:", newValue);
            sendUpdate(newValue, offerB);
            return newValue;
        });
    } else if (userEmail === ownerBEmail) {
        setOfferB((prev) => {
            console.log("🔼 handleIncrease -> Текущее значение offerB (до):", prev);
            const prevValue = Number(prev) || 0;
            const newValue = Number((prevValue + 10).toFixed(2));
            console.log("✅ handleIncrease -> Новое значение offerB:", newValue);
            sendUpdate(offerA, newValue);
            return newValue;
        });
    }
};


const handleDecrease = () => {
    console.log("🔽 Уменьшение цены: userEmail =", userEmail, "ownerAEmail =", ownerAEmail, "ownerBEmail =", ownerBEmail);

    if (userEmail === ownerAEmail) {
        setOfferA((prev) => {
            console.log("🔽 handleDecrease -> Текущее значение offerA (до):", prev);
            const prevValue = Number(prev) || 0;
            const newValue = Math.max(0, Number((prevValue - 10).toFixed(2))); // 🔒 Ограничиваем до 0
            console.log("✅ handleDecrease -> Новое значение offerA:", newValue);
            sendUpdate(newValue, offerB);
            return newValue;
        });
    } else if (userEmail === ownerBEmail) {
        setOfferB((prev) => {
            console.log("🔽 handleDecrease -> Текущее значение offerB (до):", prev);
            const prevValue = Number(prev) || 0;
            const newValue = Math.max(0, Number((prevValue - 10).toFixed(2))); // 🔒 Ограничиваем до 0
            console.log("✅ handleDecrease -> Новое значение offerB:", newValue);
            sendUpdate(offerA, newValue);
            return newValue;
        });
    }
};






useEffect(() => {
    // Запрашиваем статус сделки при загрузке компонента
    axios.get(`https://ecomaner.com/barter/api/deals/${dealId}/`, {
        headers: { "Authorization": `Token ${localStorage.getItem("authToken")}` }
    })
    .then(response => setDealStatus(response.data.status))
    .catch(error => console.error("Ошибка загрузки статуса сделки:", error));
}, [dealId]);

//  Accept deal
const handleAcceptDeal = async () => {
    try {
        const token = localStorage.getItem("authToken");
        const csrfToken = Cookies.get("csrftoken");

        const response = await axios.patch(`https://ecomaner.com/barter/api/deals/${dealId}/confirm/`, {}, {
            headers: { "Authorization": `Token ${token}`, "X-CSRFToken": csrfToken },
            withCredentials: true,
        });

        alert(response.data.message);
        setDealStatus("started"); // Обновляем статус в UI
    } catch (error) {
        console.error("Ошибка принятия сделки:", error);
        alert("Не удалось принять сделку.");
    }
};

//  Accept deal with pay
const handlePayDifference = async () => {
    try {
        console.log("📡 Отправляем API-запрос:", `https://ecomaner.com/barter/api/deals/${dealId}/confirm/`);

        const token = localStorage.getItem("authToken");
        const csrfToken = Cookies.get("csrftoken");

        const response = await axios.patch(`https://ecomaner.com/barter/api/deals/${dealId}/confirm/`, {}, {
            headers: {
                "Authorization": `Token ${token}`,
                "X-CSRFToken": csrfToken,
            },
            withCredentials: true,
        });

        alert("✅ Баллы доплачены, сделка началась!");
        setDealStatus("started");

    } catch (error) {
        console.error("Ошибка доплаты:", error);
        alert("❌ Ошибка при доплате.");
    }
};


const handleDirectInput = (e, offerType) => {
    const newValue = Math.max(0, Number(e.target.value)); // 🔒 Ограничиваем минимумом 0

    if (offerType === "A") {
        setOfferA(newValue);
        sendUpdate(newValue, offerB);
    } else {
        setOfferB(newValue);
        sendUpdate(offerA, newValue);
    }
};

//  Mark deal as "In Transit"
const handleMarkAsInTransit = async () => {
    try {
        console.log("📡 Отправляем API-запрос:", `https://ecomaner.com/barter/api/deals/${dealId}/mark-in-transit/`);

        const token = localStorage.getItem("authToken");
        const csrfToken = Cookies.get("csrftoken");

        const response = await axios.post(
            `https://ecomaner.com/barter/api/deals/${dealId}/mark-in-transit/`,
            {},
            {
                headers: {
                    "Authorization": `Token ${token}`,
                    "X-CSRFToken": csrfToken,
                },
                withCredentials: true,
            }
        );

        alert("✅ Сделка переведена в статус 'В дороге'!");
        setDealStatus("in_transit"); // Обновляем статус в UI

    } catch (error) {
        console.error("Ошибка перевода сделки в статус 'В дороге':", error);
        alert("❌ Не удалось изменить статус.");
    }
};

//  Mark deal as "Received"
const handleMarkAsReceived = async () => {
    try {
        console.log("📡 Отправляем API-запрос:", `https://ecomaner.com/barter/api/deals/${dealId}/mark-as-received/`);

        const token = localStorage.getItem("authToken");
        const csrfToken = Cookies.get("csrftoken");

        const response = await axios.post(
            `https://ecomaner.com/barter/api/deals/${dealId}/mark-as-received/`,
            {},
            {
                headers: {
                    "Authorization": `Token ${token}`,
                    "X-CSRFToken": csrfToken,
                },
                withCredentials: true,
            }
        );

        alert(response.data.message);

        // ✅ Логируем обновленный статус после нажатия
        console.log("🔍 Обновленный статус сделки:", response.data.status);
        console.log("📌 Получение инициатором:", response.data.initiator_received);
        console.log("📌 Получение партнером:", response.data.partner_received);

        setDealStatus(response.data.status);  // ✅ Обновляем статус в UI
        setInitiatorReceived(response.data.initiator_received || false);
        setPartnerReceived(response.data.partner_received || false);

    } catch (error) {
        console.error("Ошибка подтверждения получения товара:", error);
        alert("❌ Не удалось подтвердить получение.");
    }
};


//  Mark deal as "Canceled"
const handleCancelDeal = async () => {
    try {
        console.log("📡 Отправляем API-запрос на отмену:", `https://ecomaner.com/barter/api/deals/${dealId}/cancel/`);

        const token = localStorage.getItem("authToken");
        const csrfToken = Cookies.get("csrftoken");

        await axios.post(
            `https://ecomaner.com/barter/api/deals/${dealId}/cancel/`,
            {},
            {
                headers: {
                    "Authorization": `Token ${token}`,
                    "X-CSRFToken": csrfToken,
                },
                withCredentials: true,
            }
        );

        alert("❌ Сделка отменена!");
        window.location.reload();

    } catch (error) {
        console.error("Ошибка отмены сделки:", error);
        alert("❌ Не удалось отменить сделку.");
    }
};




console.log("🔍 Проверка перед кнопкой:", {
  priceDifference,
  userBalance,
  userEmail,
  ownerAEmail,
  ownerBEmail,
  offerA,
  offerB
});

console.log("🔥 Проверяем dealId в TradePanel.js:", dealId);

return (
    <div className="trade-panel">
        <h3>Торги</h3>
        <p>Разница в стоимости: <strong>{priceDifference} баллов</strong></p>

	{/* 🔥 Выводим статус сделки (заметно) */}
	<p><strong>Статус сделки:</strong> <span className="deal-status">{dealStatus}</span></p>

	{/* 🔥 Информация о товарах и ролях */}
	<p><strong>Товар инициатора:</strong> {itemA.title} <span className="label">Инициатор</span></p>
	<p><strong>Товар партнера:</strong> {itemB.title} <span className="label">Партнер</span></p>

	{/* 🔥 Баланс пользователя */}
	<h4>Баланс</h4>
	<p><strong>Ваш баланс:</strong> {userBalance} баллов</p>
	<p><strong>Зарезервировано:</strong> {reservedBalance} баллов</p>




        {dealStatus === "active" &&  (
            <>
                <div>
                    <input
                        type="number"
                        value={userEmail === ownerAEmail ? offerA : offerB}
                        onChange={(e) => handleDirectInput(e, userEmail === ownerAEmail ? "A" : "B")}
                        min="0"
                        step="1"
                    />
                    <span> — {userEmail === ownerAEmail ? offerB : offerA} баллов</span>
                </div>

                {priceDifference > 0 && userBalance >= priceDifference &&     
			        ((userEmail === itemA.owner && offerA < offerB) || 
     			    (userEmail === itemB.owner && offerB < offerA)) && (
                    <button onClick={handlePayDifference}>
                        Доплатить {priceDifference} баллов
                    </button>
                )}
            </>
        )}

        {canAccept && dealStatus === "active" &&  (
            <button 
                onClick={handleAcceptDeal} 
                className="accept-button" 
                disabled={userBalance < priceDifference}
            >
                {userBalance < priceDifference ? "Недостаточно баллов" : "Принять сделку"}
            </button>
        )}

        {dealStatus === "started" && (
            <button onClick={handleMarkAsInTransit} className="in-transit-button">
                Отправлено
            </button>
        )}

        {dealStatus === "in_transit" && (
            <button onClick={handleMarkAsReceived} className="received-button">
                Товар получен
            </button>
        )}


        <button 
  		onClick={handleCancelDeal} 
  		className="cancel-button" 
  		disabled={dealStatus === "completed" || dealStatus === "cancelled"}
		>
  		Отменить сделку
	</button>




    </div>
);





};

export default TradePanel;
