import React, { useEffect, useState } from 'react';
import GeoPhotoForm from '../components/GeoPhotoForm';

const HomePage = ({ userEmail, isAuthChecked }) => {
  console.log("Получен userEmail в HomePage:", userEmail);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("HomePage useEffect запущен");
    fetch('/api/main/home/')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Ошибка загрузки данных с сервера');
        }
      })
      .then(data => {
        setMessage(data.message);
      })
      .catch(error => {
        console.error("Ошибка при получении данных:", error);
        setMessage('Не удалось загрузить данные.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !isAuthChecked) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h1>{message}</h1>
      <p>Текущий userEmail: {userEmail || "не определен"}</p> {/* Добавляем здесь */}
      {userEmail ? (
        <GeoPhotoForm userEmail={userEmail} />
      ) : (
        <p>Пожалуйста, войдите в систему, чтобы добавить локацию.</p>
      )}
    </div>
  );
};

export default HomePage;