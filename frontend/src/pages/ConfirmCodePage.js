// src/pages/ConfirmCodePage.js
import React, { useState } from 'react';
import axios from '../axiosSetup';

const ConfirmCodePage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleConfirmCode = async () => {
    console.log("Клик на кнопку 'Подтвердить' с данными:", { email, code });

    try {
      const response = await axios.post('/accounts/confirm-code/', { email, code }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage("Ваш аккаунт успешно активирован.");
      console.log("Ответ сервера при подтверждении кода:", response.data);
    } catch (error) {
      setMessage("Ошибка подтверждения. Пожалуйста, попробуйте снова.");
      console.error("Ошибка подтверждения:", error);
    }
  };

  return (
    <div>
      {console.log("Рендер компонента подтверждения кода. Текущее состояние email:", email, "code:", code, "message:", message)}
      <h2>Подтверждение кода</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          console.log("Изменение email:", e.target.value);
          setEmail(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Введите код"
        value={code}
        onChange={(e) => {
          console.log("Изменение кода:", e.target.value);
          setCode(e.target.value);
        }}
      />
      <button onClick={() => {
        console.log("Клик на кнопку 'Подтвердить'");
        handleConfirmCode();
      }}>Подтвердить</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ConfirmCodePage;
