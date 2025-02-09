import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    const currentPath = window.location.pathname.split('/').slice(2).join('/');
    navigate(`/${lng}/${currentPath}`);
    i18n.changeLanguage(lng);
    console.log("Язык переключён на:", lng);
  };

  // Контейнер теперь внутри хедера, но кнопки меньше и без лишнего отступа
  const switcherStyle = {
    position: 'relative',
    top: '5px',
    left: '0px', // 🔹 Убрали лишний отступ слева
    display: 'flex',
    gap: '3px', // 🔹 Уменьшили расстояние между кнопками
    zIndex: 1000,
  };

  // Еще больше уменьшаем кнопки!
  const buttonStyle = {
    backgroundColor: '#ccc',
    color: 'black',
    border: '1px solid #aaa',
    padding: '1px 3px', // 🔹 Еще меньше отступы внутри
    cursor: 'pointer',
    fontSize: '11px', // 🔹 Снова уменьшаем текст
    borderRadius: '2px',
    minWidth: '30px', // 🔹 Еще меньше ширина кнопок
    textAlign: 'center',
    fontWeight: 'bold',
    transition: 'background-color 0.3s, color 0.3s',
  };

  return (
    <div style={switcherStyle}>
      <button onClick={() => changeLanguage('ua')} style={buttonStyle}>UA</button>
      <button onClick={() => changeLanguage('en')} style={buttonStyle}>EN</button>
      <button onClick={() => changeLanguage('ru')} style={buttonStyle}>RU</button>
    </div>
  );
};

export default LanguageSwitcher;
