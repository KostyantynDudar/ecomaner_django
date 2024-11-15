// src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from '../axiosSetup';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    // Логирование клика на кнопку "Зарегистрироваться" и введенных данных
    console.log("Клик на кнопку 'Зарегистрироваться' с данными:", { email, password });

    try {
      const response = await axios.post('/api/accounts/register/', { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage("Регистрация прошла успешно");
      console.log("Ответ сервера при регистрации:", response.data);
    } catch (error) {
      setMessage("Ошибка регистрации. Пожалуйста, попробуйте снова.");
      console.error("Ошибка регистрации:", error);
    }
  };

  return (
    <div>
      <h2>Регистрация</h2>
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
      <button onClick={handleRegister}>Зарегистрироваться</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterPage;
