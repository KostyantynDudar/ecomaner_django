import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Подключение отдельных файлов переводов
import aboutTranslations from './translations/about';
import civilizationsTranslations from './translations/civilizations';
import eternalThingsTranslations from './translations/eternalThings';
import gameplayTranslations from './translations/gameplay';
import howItWorksTranslations from './translations/how_it_works';
import newsTranslations from './translations/news';

// Собираем все переводы в один объект
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

// Инициализация i18next
i18n
  .use(initReactI18next) // Подключаем React к i18next
  .init({
    resources, // Передаем переводы
    lng: 'ru', // Язык по умолчанию
    fallbackLng: 'ru', // Резервный язык
    interpolation: {
      escapeValue: false, // React уже экранирует данные
    },
    react: {
      useSuspense: true, // Включаем Suspense
    },
  });

export default i18n;
