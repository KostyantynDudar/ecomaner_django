import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    window.location.pathname = `/${lang}/about`; // Перенаправление с выбранным языком
  };

  return (
    <div>
      <button onClick={() => changeLanguage("ru")}>Русский</button>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("ua")}>Українська</button>
    </div>
  );
};

export default LanguageSwitcher;
