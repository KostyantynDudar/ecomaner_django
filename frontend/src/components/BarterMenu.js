// frontend/src/components/BarterMenu.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/BarterMenu.css';

const BarterMenu = () => {
    return (
        <nav className="barter-menu">
            <Link to="/barter">Личный кабинет</Link>
            <Link to="/barter/all-requests">Список заявок</Link>
            <Link to="/barter/create-request">Создать заявку</Link>
            <Link to="/barter/docs">Документация</Link>
        </nav>
    );
};

export default BarterMenu;

// Подключаем это меню в основной компонент раздела Бартера
// Например, в файле BarterPage.js:
// import BarterMenu from './BarterMenu';
// <BarterMenu />
