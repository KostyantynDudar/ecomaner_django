import React, { useState, useEffect } from "react";
import axios from "axios";
import BarterMenu from '../../components/BarterMenu';
import "../../styles/BarterTable.css";

const AllBarterRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get("https://ecomaner.com/barter/api/all-requests/");
                setRequests(response.data);
            } catch (err) {
                setError("Ошибка загрузки заявок.");
                console.error("API error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <BarterMenu />
            <h1>Все заявки на бартер</h1>
            <table className="barter-table">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Описание</th>
                        <th>Тип</th>
                        <th>Адрес</th>
                        <th>Оценка</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.length > 0 ? (
                        requests.map((req) => (
                            <tr key={req.id}>
                                <td><strong>{req.title}</strong></td>
                                <td>{req.description}</td>
                                <td>{req.barter_type || "Не указан"}</td>
                                <td>{req.location || "Не указан"}</td>
                                <td>{req.estimated_value || "-"}</td>
                                <td>{req.status}</td>
                                <td>
                                    <button className="barter-action-btn">Открыть сделку</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7">Заявок пока нет.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllBarterRequests;
