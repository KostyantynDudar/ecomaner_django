import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="hamburger-container">
      <button className="hamburger-button" onClick={toggleMenu}>
        ☰
      </button>
      <nav className={`hamburger-menu ${isOpen ? 'active' : ''}`}>
        <Link to="/about" onClick={toggleMenu}>О проекте</Link>
        <Link to="/how-it-works" onClick={toggleMenu}>Как это работает</Link>
        <Link to="/faq" onClick={toggleMenu}>FAQ</Link>
        <Link to="/join" onClick={toggleMenu}>Участие</Link>
        <Link to="/map" onClick={toggleMenu}>Карта</Link>
        <Link to="/gameplay" onClick={toggleMenu}>Игровой процесс</Link>
        <Link to="/civilizations" onClick={toggleMenu}>Цивилизации</Link>
        <Link to="/eternal-things" onClick={toggleMenu}>Вечные вещи</Link>
        <Link to="/news" onClick={toggleMenu}>Новости</Link>
        <Link to="/contact" onClick={toggleMenu}>Контакты</Link>
        <Link to="/barter" onClick={toggleMenu}>Бартер</Link>
      </nav>
    </div>
  );
};

export default HamburgerMenu;
