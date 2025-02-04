import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SocialShare from "./SocialShare"; // Подключаем кнопку "Поделиться"
import "../styles/News.css";

const NewsDetail = () => {
    const { id } = useParams(); // Получаем ID из URL
    const [newsItem, setNewsItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`/api/news/${id}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                setNewsItem(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка при получении новости:", error);
                setError("Ошибка загрузки новости.");
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p className="loading">Загрузка...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!newsItem) return <p className="error">Новость не найдена.</p>;

    return (
        <div className="news-detail">
            <h1>{newsItem.title}</h1>
            <p className="news-content">{newsItem.content}</p>

            {/* Изображения */}
            {newsItem.images.length > 0 && (
                <div className="news-images">
                    {newsItem.images.map((img) => (
                        <img key={img.id} src={img.image} alt={newsItem.title} className="news-image" />
                    ))}
                </div>
            )}

            {/* Кнопки "Лайк" и "Поделиться" */}
            <div className="news-actions">
                <SocialShare title={newsItem.title} url={`https://ecomaner.com/news/${id}`} />
            </div>
        </div>
    );
};

export default NewsDetail;
