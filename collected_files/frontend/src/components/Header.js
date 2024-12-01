// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = ({ isLoggedIn, onLogout }) => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Экоманер</Link>
      </div>
      <nav className="menu">
        <Link to="/about">О проекте</Link>
        <Link to="/how-it-works">Как это работает</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/join">Участие</Link>
        <Link to="/map">Карта</Link>
        <Link to="/gameplay">Игровой процесс</Link>
        <Link to="/civilizations">Цивилизации</Link>
        <Link to="/eternal-things">Вечные вещи</Link>
        <Link to="/news">Новости</Link>
        <Link to="/contact">Контакты</Link>
      </nav>
      <div className="auth-buttons">
        {/* Показываем кнопки в зависимости от статуса авторизации */}
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="login-button">Вход</Link>
            <Link to="/register" className="signup-button">Регистрация</Link>
          </>
        ) : (
          <>
            <Link to="/account" className="account-button">Личный кабинет</Link>
            <button className="logout-button" onClick={onLogout}>Выйти</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
