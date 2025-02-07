import React, { useEffect, useState } from "react";
import axios from "axios";
import BarterMenu from "../../components/BarterMenu";
import "../../styles/BarterTable.css";

const AllBarterRequests = () => {
    const [requests, setRequests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.get("https://ecomaner.com/barter/api/all-requests/");
                setRequests(response.data);
            } catch (err) {
                setError("Ошибка загрузки заявок.");
                console.error("API error:", err);
            }
        };
        fetchRequests();
    }, []);

    return (
        <>
            <BarterMenu />
            <div className="barter-container">
                <h1>Все заявки на бартер</h1>
                {error && <p className="error">{error}</p>}
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
                                    <td>{req.title}</td>
                                    <td>{req.description}</td>
                                    <td>{req.category}</td>
                                    <td>{req.address || "Не указан"}</td>
                                    <td>{req.value || "-"}</td>
                                    <td>{req.status}</td>
                                    <td>
                                        <button className="barter-btn">Открыть сделку</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">Нет доступных заявок</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default AllBarterRequests;
