import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import HamburgerMenu from './HamburgerMenu';

const Header = ({ isLoggedIn, onLogout }) => {
  return (
    <header className="header">

      <div className="logo">
        <a href="https://ecomaner.com/" className="add-location">
          ➕ Добавить локацию
        </a>
        <a href="https://ecomaner.com/game" className="game-button">
          🎮 Игра
        </a>
      </div>

      <div className="right-section">
        <HamburgerMenu />
        <div className="auth-buttons">
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
      </div>
    </header>
  );
};

export default Header;
