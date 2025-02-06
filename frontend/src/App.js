// frontend/src/App.js

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
import NewsDetail from "./components/NewsDetail";
import Map from './components/Map';
import AccountPage from './pages/AccountPage';
import BarterPage from './pages/barter/AccountPage'; // Личный кабинет бартера
import CreateBarterRequest from './pages/barter/CreateBarterRequest'; // Создание заявки
import AllBarterRequests from './pages/barter/AllBarterRequests'; // Просмотр всех заявок

import axios from './axiosSetup';
import './styles/style.css';
import './i18n';
import { useTranslation } from 'react-i18next';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { i18n } = useTranslation();

  useEffect(() => {
    const langFromPath = window.location.pathname.split('/')[1];
    if (['en', 'ru', 'ua'].includes(langFromPath) && langFromPath !== i18n.language) {
      i18n.changeLanguage(langFromPath);
    }
  }, [i18n]);

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

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/accounts/logout/', {}, { headers: { 'Content-Type': 'application/json' } });
      setIsLoggedIn(false);
      window.location.reload();
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  };

  if (!isAuthChecked) {
    return <div className="loading-screen">Проверка авторизации...</div>;
  }

  return (
    <Router>
      <div>
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
          <Route path="/news/:id" element={<NewsDetail />} />
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

          {/* 🔹 Раздел бартера */}
          <Route path="/barter" element={isLoggedIn ? <BarterPage /> : <Navigate to="/login" />} />
          <Route path="/barter/create-request" element={isLoggedIn ? <CreateBarterRequest /> : <Navigate to="/login" />} />
          <Route path="/barter/all-requests" element={isLoggedIn ? <AllBarterRequests /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
