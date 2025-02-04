import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SocialShare from "./SocialShare"; // Подключаем кнопку "Поделиться"
import "../styles/News.css";

const NewsList = () => {
    const [news, setNews] = useState([]);

    useEffect(() => {
        console.log("Запрос к API отправляется");
        fetch("/api/news/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Ответ от API:", data);
                setNews(data);
            })
            .catch((error) => console.error("Ошибка при запросе API:", error));
    }, []);

    const handleLike = (id) => {
        fetch(`/api/news/${id}/like/`, { method: "POST" })
            .then((response) => response.json())
            .then((data) => {
                setNews((prevNews) =>
                    prevNews.map((item) =>
                        item.id === id ? { ...item, likes_count: data.likes } : item
                    )
                );
            })
            .catch((error) => console.error("Ошибка при лайке:", error));
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Новости</h1>
            {news.length === 0 ? (
                <p>Нет новостей</p>
            ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {news.map((item) => (
                        <li key={item.id} style={{ marginBottom: "30px", borderBottom: "1px solid #444", paddingBottom: "20px" }}>
                            <h2>
                                <Link to={`/news/${item.id}`} style={{ textDecoration: "none", color: "#28a745" }}>
                                    {item.title}
                                </Link>
                            </h2>
                            
                            <p>
                                {item.content.length > 200 
                                    ? item.content.slice(0, 200) + "... " 
                                    : item.content}
                                {item.content.length > 200 && (
                                    <Link to={`/news/${item.id}`} style={{ color: "#007bff", textDecoration: "none", fontWeight: "bold" }}>
                                        Читать дальше
                                    </Link>
                                )}
                            </p>

                            {/* Отображение всех изображений */}
                            {item.images.length > 0 && (
                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                    {item.images.map((img) => (
                                        <img
                                            key={img.id}
                                            src={img.image}
                                            alt={item.title}
                                            style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Блок с лайками */}
                            <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
                                <button
                                    onClick={() => handleLike(item.id)}
                                    style={{
                                        padding: "8px 12px",
                                        backgroundColor: "#28a745",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        cursor: "pointer",
                                        marginRight: "10px"
                                    }}
                                >
                                    👍 Лайк ({item.likes_count})
                                </button>
                                <SocialShare title={item.title} url={`https://ecomaner.com/news/${item.id}`} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NewsList;
