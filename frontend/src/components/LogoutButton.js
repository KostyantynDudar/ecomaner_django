// src/components/LogoutButton.js
import React from 'react';
import axios from '../axiosSetup';

const LogoutButton = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      await axios.post('/accounts/logout/', {}, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, // обязательно для отправки сессии
      });
      onLogout(); // Обновляем состояние
      window.location.reload(); // Перезагружаем страницу
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  return (
    <button onClick={handleLogout}>Выйти</button>
  );
};

export default LogoutButton;
