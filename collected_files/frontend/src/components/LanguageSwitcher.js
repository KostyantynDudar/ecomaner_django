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

  return (
    <div>
      <button onClick={() => changeLanguage('ua')}>Українська</button>
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('ru')}>Русский</button>

    </div>
  );
};

export default LanguageSwitcher;
