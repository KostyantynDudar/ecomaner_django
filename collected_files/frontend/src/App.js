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

import './i18n'; // Подключаем инициализацию i18n
import { useTranslation } from 'react-i18next'; // Для работы с переводами
import { useParams } from 'react-router-dom'; // Для получения языка из URL

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние авторизации
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Проверка авторизации завершена
  const [userEmail, setUserEmail] = useState(''); // Email текущего пользователя
  const { lang } = useParams(); // Получаем текущий язык из URL
  const { i18n } = useTranslation(); // Используем i18next для управления языком

  // Проверяем авторизацию при загрузке приложения
  useEffect(() => {
  const checkAuth = async () => {
    try {
      const response = await axios.get('/accounts/check-auth/', {
        withCredentials: true, // Убедитесь, что куки отправляются
      });
      console.log("Ответ check-auth:", response.data); // Выводим, что возвращает сервер
      setIsLoggedIn(response.data.isAuthenticated); // Устанавливаем статус авторизации
      if (response.data.isAuthenticated) {
        setUserEmail(response.data.email); // Обновляем email
        console.log("Email пользователя обновлен:", response.data.email); // Логируем email
      }
    } catch (error) {
      console.error('Ошибка при проверке авторизации:', error);
      setIsLoggedIn(false); // Если ошибка, то пользователь не авторизован
    } finally {
      setIsAuthChecked(true); // Завершаем проверку авторизации
    }
  };

  checkAuth();
}, []);

  // Логика смены языка
  useEffect(() => {
    if (lang && ['en', 'ru', 'ua'].includes(lang)) {
      i18n.changeLanguage(lang);
    } else {
      i18n.changeLanguage('ru');
    }
  }, [lang, i18n]);

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
  return <div className="loading-screen">Проверка авторизации...</div>;
}


  return (
    <Router>
      <div>
        {/* Передаем состояние авторизации и функцию выхода в Header */}
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        <Routes>
          {/* Основные страницы */}

          <Route path="/about" element={<Navigate to="/ru/about" />} />
          <Route path="/:lang/about" element={<AboutPage />} />

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

          <Route path="/" element={<HomePage userEmail={userEmail} isAuthChecked={isAuthChecked} />} />


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
