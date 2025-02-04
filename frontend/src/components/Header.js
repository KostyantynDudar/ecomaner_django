import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';
import HamburgerMenu from './HamburgerMenu';

const Header = ({ isLoggedIn, onLogout }) => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Экоманер</Link>
      </div>

      <div className="right-section">
        {/* Гамбургер-меню (теперь оно всегда отображается) */}
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
