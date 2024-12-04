import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Подключение файлов перевода
import aboutTranslations from './translations/about';
import civilizationsTranslations from './translations/civilizations';
import eternalThingsTranslations from './translations/eternalThings';
import gameplayTranslations from './translations/gameplay';
import howItWorksTranslations from './translations/how_it_works';
import newsTranslations from './translations/news';

// Ресурсы для переводов
const resources = {
  en: {
    about: aboutTranslations.en,
    civilizations: civilizationsTranslations.en,
    eternalThings: eternalThingsTranslations.en,
    gameplay: gameplayTranslations.en,
    howItWorks: howItWorksTranslations.en,
    news: newsTranslations.en,
  },
  ru: {
    about: aboutTranslations.ru,
    civilizations: civilizationsTranslations.ru,
    eternalThings: eternalThingsTranslations.ru,
    gameplay: gameplayTranslations.ru,
    howItWorks: howItWorksTranslations.ru,
    news: newsTranslations.ru,
  },
  ua: {
    about: aboutTranslations.ua,
    civilizations: civilizationsTranslations.ua,
    eternalThings: eternalThingsTranslations.ua,
    gameplay: gameplayTranslations.ua,
    howItWorks: howItWorksTranslations.ua,
    news: newsTranslations.ua,
  },
};

// Ручное определение языка
const detectLanguage = () => {
  const urlLang = window.location.pathname.split('/')[1]; // Извлекаем язык из URL
  if (['en', 'ru', 'ua'].includes(urlLang)) {
    return urlLang;
  }
  const browserLang = navigator.language.split('-')[0];
  return ['en', 'ru', 'ua'].includes(browserLang) ? browserLang : 'ua'; // Язык по умолчанию
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ua', // Устанавливаем язык по умолчанию
    fallbackLng: 'ua', // Резервный язык
    debug: true,
    interpolation: {
      escapeValue: false, // Безопасность вставки
    },
  });

export default i18n;
