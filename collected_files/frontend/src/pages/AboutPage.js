import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher'; // Импорт компонента переключателя языка

const AboutPage = () => {
  const { i18n } = useTranslation();

  // Данные для текущего языка
  const aboutData = i18n.store.data[i18n.language]?.about?.about;

  // Проверка на наличие данных
  if (!aboutData) {
    return <div>Ошибка: данные для текущего языка отсутствуют.</div>;
  }

  // Универсальная функция для рендера секций
  const renderSection = (title, list) => {
    if (!title || !list || list.length === 0) return null; // Проверка на пустые данные
    return (
      <section>
        <h2>{title}</h2>
        <ul>
          {list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
    );
  };

  return (
    <div>
      {/* Компонент для переключения языка */}
      <LanguageSwitcher />

      {/* Заголовок страницы */}
      <h1>{aboutData.title}</h1>

      {/* Раздел: Обзор */}
      <section>
        <h2>{aboutData.overview?.title}</h2>
        <p>{aboutData.overview?.intro}</p>
        <p>{aboutData.overview?.goal}</p>
        <p>{aboutData.overview?.mission}</p>
      </section>

      {/* Остальные секции */}
      {renderSection(
        aboutData.roles?.title,
        aboutData.roles?.list.map((role) => `${role.role}: ${role.description}`)
      )}
      {renderSection(aboutData.processes?.title, aboutData.processes?.list)}
      {renderSection(aboutData.rewards?.title, aboutData.rewards?.details)}
      {renderSection(aboutData.gamification?.title, aboutData.gamification?.list)}
      {renderSection(aboutData.map?.title, aboutData.map?.details)}
      {renderSection(aboutData.infrastructure?.title, aboutData.infrastructure?.list)}
      {renderSection(aboutData.funding?.title, aboutData.funding?.list)}
      {renderSection(aboutData.partnerships?.title, aboutData.partnerships?.list)}
      {renderSection(aboutData.transparency?.title, aboutData.transparency?.list)}
      {renderSection(aboutData.education?.title, aboutData.education?.details)}
      {renderSection(aboutData.marketing?.title, aboutData.marketing?.details)}
      {renderSection(aboutData.innovations?.title, aboutData.innovations?.details)}
      {renderSection(aboutData.socialNetwork?.title, aboutData.socialNetwork?.details)}
    </div>
  );
};

export default AboutPage;
