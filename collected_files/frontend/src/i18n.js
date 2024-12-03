import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import aboutTranslations from './translations/about';
import civilizationsTranslations from './translations/civilizations';
import eternalThingsTranslations from './translations/eternalThings';
import gameplayTranslations from './translations/gameplay';
import howItWorksTranslations from './translations/how_it_works';
import newsTranslations from './translations/news';

// Собираем переводы
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

// Определение языка вручную
const detectLanguage = () => {
  const browserLang = navigator.language || navigator.userLanguage;
  return ['ua', 'ru', 'en'].includes(browserLang) ? browserLang : 'ua';
};

i18n
  .use(initReactI18next) // Подключаем React к i18next
  .init({
    resources,
    lng: detectLanguage(), // Устанавливаем язык на основе настроек браузера
    fallbackLng: 'ua', // Язык по умолчанию
    interpolation: {
      escapeValue: false, // React уже экранирует данные
    },
  });

export default i18n;