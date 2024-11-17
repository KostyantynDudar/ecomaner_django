// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import Header from './components/Header';
import RegisterPage from './pages/RegisterPage';
import ConfirmCodePage from './pages/ConfirmCodePage';
import LoginPage from './pages/LoginPage';
import GameplayPage from './pages/GameplayPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FaqPage from './pages/FaqPage';
import ParticipationPage from './pages/ParticipationPage';
import CivilizationsPage from './pages/CivilizationsPage';
import EternalThingsPage from './pages/EternalThingsPage';
import ContactPage from './pages/ContactPage';
import NewsList from './components/NewsList';
import Map from './components/Map';
import AccountPage from './pages/AccountPage';
import LogoutButton from './components/LogoutButton';
import axios from './axiosSetup'; // Настройка axios для API запросов
import './styles/style.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние авторизации
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Проверка авторизации завершена

  // Проверяем авторизацию при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/accounts/check-auth/', {
          withCredentials: true, // Убедитесь, что куки отправляются
        });
        setIsLoggedIn(response.data.isAuthenticated); // Устанавливаем статус авторизации
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        setIsLoggedIn(false); // Если ошибка, то пользователь не авторизован
      } finally {
        setIsAuthChecked(true); // Завершаем проверку авторизации
      }
    };

    checkAuth();
  }, []);

  // Успешный вход в систему
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Выход из системы
  const handleLogout = async () => {
    try {
      await axios.post('/accounts/logout/', {}, { headers: { 'Content-Type': 'application/json' } });
      setIsLoggedIn(false); // Обновляем состояние после выхода
      window.location.reload(); // Обновляем страницу для применения изменений
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  // Пока проверка авторизации не завершена, отображаем загрузочный экран
  if (!isAuthChecked) {
    return <div>Загрузка...</div>;
  }

  return (
    <Router>
      <div>
        {/* Передаем состояние авторизации и функцию выхода в Header */}
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        <Routes>
          {/* Основные страницы */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gameplay" element={<GameplayPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/join" element={<ParticipationPage />} />
          <Route path="/civilizations" element={<CivilizationsPage />} />
          <Route path="/eternal-things" element={<EternalThingsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/news" element={<NewsList />} />
          <Route path="/map" element={<Map />} />

          {/* Регистрация и вход */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/confirm-code" element={<ConfirmCodePage />} />
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/account" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
            }
          />

          {/* Личный кабинет */}
          <Route path="/account" element={isLoggedIn ? <AccountPage /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
