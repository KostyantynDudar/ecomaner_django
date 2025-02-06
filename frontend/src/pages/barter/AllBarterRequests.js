//  /home/ecomaner_django/frontend/src/pages/barter/AllBarterRequests.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import BarterMenu from '../../components/BarterMenu';


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
            <ul>
                {requests.length > 0 ? (
                    requests.map((req) => (
                        <li key={req.id}>
                            <strong>{req.title}</strong> - {req.description}
                        </li>
                    ))
                ) : (
                    <p>Заявок пока нет.</p>
                )}
            </ul>
        </div>
    );
};

export default AllBarterRequests;
