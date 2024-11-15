// src/pages/LoginPage.js
import React, { useState } from 'react';
import axios from '../axiosSetup';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    // Логирование клика на кнопку "Войти" и введенных данных
    console.log("Клик на кнопку 'Войти' с данными:", { email, password });

    try {
      const response = await axios.post('/api/accounts/login/', { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage("Вход выполнен успешно");
      console.log("Ответ сервера при входе:", response.data);
    } catch (error) {
      setMessage("Ошибка входа. Проверьте свои данные.");
      console.error("Ошибка входа:", error);
    }
  };

  return (
    <div>
      <h2>Вход</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Войти</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default LoginPage;
