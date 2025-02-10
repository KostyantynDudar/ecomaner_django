import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosSetup';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log("Клик на кнопку 'Войти' с данными:", { email, password });

    try {
      const response = await axios.post('/accounts/api-login/', { email, password }, {
        headers: { 'Content-Type': 'application/json' },
      });
      setMessage("Вход выполнен успешно");
      console.log("Ответ сервера при входе:", response.data);

      // Сохраняем токен в localStorage
      localStorage.setItem("authToken", response.data.token);

      // Сообщаем об успешном входе
      onLoginSuccess();

      // Перенаправляем в личный кабинет
      navigate('/account');
      window.location.reload(); // Обновляем страницу
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
