// src/pages/RegisterPage.js
import React, { useState } from 'react';
import axios from '../axiosSetup';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    console.log("Клик на кнопку 'Зарегистрироваться' с данными:", { email, password });

    try {
      const response = await axios.post('/accounts/register/', { email, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setMessage("Регистрация прошла успешно. Пожалуйста, проверьте свою почту для получения кода подтверждения.");
      console.log("Ответ сервера при регистрации:", response.data);
    } catch (error) {
      setMessage("Ошибка регистрации. Пожалуйста, попробуйте снова.");
      console.error("Ошибка регистрации:", error);
    }
  };

  return (
    <div>
      {console.log("Рендер компонента. Текущее состояние email:", email, "password:", password, "message:", message)}
      <h2>Регистрация</h2>
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
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => {
          console.log("Изменение password:", e.target.value);
          setPassword(e.target.value);
        }}
      />
      <button onClick={() => {
        console.log("Клик на кнопку 'Зарегистрироваться'");
        handleRegister();
      }}>Зарегистрироваться</button>
      {message && (
        <p>
          {message} {message.includes("успешно") && <a href="/confirm-code">Перейти на страницу подтверждения</a>}
        </p>
      )}
    </div>
  );
};

export default RegisterPage;
