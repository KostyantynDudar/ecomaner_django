// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';


const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Экоманер</Link>
      </div>
      <nav className="menu">
        <Link to="/about">О проекте</Link>
        <Link to="/how-it-works">Как это работает</Link>
        <Link to="/civilizations">Цивилизации</Link>
        <Link to="/eternal-things">Вечные вещи</Link>
        <Link to="/join">Участие</Link>
        <Link to="/news">Новости</Link>
        <Link to="/faq">FAQ</Link>
        <Link to="/contact">Контакты</Link>
      </nav>
      <div className="auth-buttons">
        <button className="login-button">Вход</button>
        <button className="signup-button">Регистрация</button>
      </div>
    </header>
  );
};

export default Header;
