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
import axios from './axiosSetup';
import './styles/style.css';

import './i18n'; // Подключение i18n
import { useTranslation } from 'react-i18next';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { i18n } = useTranslation();

useEffect(() => {
  const langFromPath = window.location.pathname.split('/')[1]; // Получаем язык из URL
  const supportedLanguages = ['en', 'ru', 'ua']; // Поддерживаемые языки

  console.log("URL language detected:", langFromPath); // Логируем язык из URL
  console.log("Current i18n language before change:", i18n.language); // Лог текущего языка i18n

  if (supportedLanguages.includes(langFromPath)) {
    if (langFromPath !== i18n.language) {
      i18n.changeLanguage(langFromPath).then(() => {
        console.log("i18n language after change:", i18n.language); // Лог после изменения языка
      }).catch((err) => {
        console.error("Error changing language:", err);
      });
    }
  } else {
    console.log("Invalid URL language. Redirecting to default (ua).");
    window.location.replace(`/ua${window.location.pathname}`);
  }
}, [i18n]);





  // Проверка авторизации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/accounts/check-auth/', { withCredentials: true });
        setIsLoggedIn(response.data.isAuthenticated);
        if (response.data.isAuthenticated) {
          setUserEmail(response.data.email);
        }
      } catch (error) {
        console.error('Ошибка при проверке авторизации:', error);
        setIsLoggedIn(false);
      } finally {
        setIsAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  // Обработчик успешного входа
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Обработчик выхода
  const handleLogout = async () => {
    try {
      await axios.post('/accounts/logout/', {}, { headers: { 'Content-Type': 'application/json' } });
      setIsLoggedIn(false);
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  // Проверка авторизации
  if (!isAuthChecked) {
    return <div className="loading-screen">Проверка авторизации...</div>;
  }

  return (
    <Router key={i18n.language}>
      <div>
        {/* Компонент Header с передачей состояния авторизации */}
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        <Routes>
          {/* Редирект на About с корректным языком */}
          <Route path="/:lang/about" element={<AboutPage />} />
          <Route path="/about" element={<Navigate to="/ua/about" />} />


          {/* Страницы */}
          <Route path="/:lang/gameplay" element={<GameplayPage />} />
          <Route path="/:lang/how-it-works" element={<HowItWorksPage />} />
          <Route path="/:lang/faq" element={<FaqPage />} />
          <Route path="/:lang/join" element={<ParticipationPage />} />
          <Route path="/:lang/civilizations" element={<CivilizationsPage />} />
          <Route path="/:lang/eternal-things" element={<EternalThingsPage />} />
          <Route path="/:lang/contact" element={<ContactPage />} />
          <Route path="/:lang/news" element={<NewsList />} />
          <Route path="/:lang/map" element={<Map />} />

          {/* Регистрация и авторизация */}
          <Route path="/:lang/register" element={<RegisterPage />} />
          <Route path="/:lang/confirm-code" element={<ConfirmCodePage />} />
          <Route path="/" element={<Navigate to="/ua" />} /> {/* Редирект на язык по умолчанию */}

          <Route
            path="/:lang/login"
            element={
              isLoggedIn ? <Navigate to="/ua/account" /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
            }
          />

          {/* Личный кабинет */}
          <Route path="/:lang/account" element={isLoggedIn ? <AccountPage /> : <Navigate to="/ua/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
