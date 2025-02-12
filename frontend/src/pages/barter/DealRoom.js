import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BarterMenu from "../../components/BarterMenu";
import TradePanel from "./TradePanel";
import ChatBox from "./ChatBox";
import "../../styles/DealRoom.css";

const DealRoom = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deal, setDeal] = useState(null);
    const [itemA, setItemA] = useState(null);
    const [itemB, setItemB] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [priceDifference, setPriceDifference] = useState(0);
    const [canAccept, setCanAccept] = useState(false);
    const [userBalance, setUserBalance] = useState(0);



    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("authToken");
                
                const balanceResponse = await axios.get(`https://ecomaner.com/barter/api/user-balance/`, {
                    headers: { "Authorization": `Token ${token}` },
                });
                setUserBalance(balanceResponse.data.balance);
                
                const response = await axios.get(`https://ecomaner.com/barter/api/deals/${id}/`, {
                    headers: { "Authorization": `Token ${token}` },
                });

                setDeal(response.data);
                
                // Загружаем товары
                const itemAResponse = await axios.get(`https://ecomaner.com/barter/api/user-requests/${response.data.item_A}/`);
                setItemA(itemAResponse.data);
                
                if (response.data.item_B) {
                    const itemBResponse = await axios.get(`https://ecomaner.com/barter/api/user-requests/${response.data.item_B}/`);
                    setItemB(itemBResponse.data);
                }
            } catch (error) {
                console.error("Ошибка загрузки сделки:", error);
                setError("Ошибка загрузки сделки");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (itemA && itemB) {
            const diff = Math.abs(itemA.estimated_value - itemB.estimated_value);
            setPriceDifference(diff);
            setCanAccept(itemA.estimated_value === itemB.estimated_value || userBalance >= diff);
        }
    }, [itemA, itemB, userBalance]);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div className="deal-room">
            <BarterMenu />
            <h1>Комната сделки #{deal?.id}</h1>
            <div className="deal-items">
                <div className="deal-item">
                    <h2>Товар A</h2>
                    {itemA ? (
                        <>
                            {itemA.image && <img src={itemA.image} alt={itemA.title} />}
                            <p><strong>{itemA.title}</strong></p>
                            <p>Цена: {itemA.estimated_value} баллов</p>
                        </>
                    ) : (
                        <p>Загрузка...</p>
                    )}
                </div>
                {itemB && (
                    <div className="deal-item">
                        <h2>Товар B</h2>
                        {itemB ? (
                            <>
                                {itemB.image && <img src={itemB.image} alt={itemB.title} />}
                                <p><strong>{itemB.title}</strong></p>
                                <p>Цена: {itemB.estimated_value} баллов</p>
                            </>
                        ) : (
                            <p>Загрузка...</p>
                        )}
                    </div>
                )}
            </div>
            
            <TradePanel dealId={id} itemA={itemA} itemB={itemB} userBalance={userBalance} />
            <ChatBox dealId={id} />
        </div>
    );
};

export default DealRoom;
