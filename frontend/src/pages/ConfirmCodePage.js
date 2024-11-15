// src/pages/ConfirmCodePage.js
import React, { useState } from 'react';
import axios from 'axios';

const ConfirmCodePage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleConfirmCode = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/accounts/confirm-code/`, { email, code });
      setMessage("Ваш аккаунт успешно активирован.");
    } catch (error) {
      setMessage("Ошибка подтверждения. Пожалуйста, попробуйте снова.");
      console.error("Ошибка подтверждения:", error);
    }
  };

  return (
    <div>
      <h2>Подтверждение кода</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Введите код"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleConfirmCode}>Подтвердить</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ConfirmCodePage;
