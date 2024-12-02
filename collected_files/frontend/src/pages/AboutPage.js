import React from "react";
import { useTranslation } from "react-i18next";

const AboutPage = () => {
  const { t } = useTranslation(); // Хук для переводов

  console.log("AboutPage рендерится");

  // Логируем все переводы для текущего языка
  console.log("Текущий язык:", i18n.language);
  console.log("Все переводы:", i18n.store.data);

  // Логируем конкретные ключи
  const rolesTitle = t("about.roles.title");
  const rolesList = t("about.roles.list", { returnObjects: true });

  console.log("rolesTitle:", rolesTitle); // Проверяем заголовок
  console.log("rolesList:", rolesList); // Проверяем массив или ошибку

  const rolesList = t('roles.list', { returnObjects: true });
  if (!Array.isArray(rolesList)) {
    console.error("rolesList должен быть массивом, получено:", rolesList);
    return <div>Ошибка: данные rolesList недоступны или некорректны.</div>;
  }

  return (
    <div>
      {/* Заголовок страницы */}
      <h1>{t("about.title")}</h1>

      {/* Раздел: Обзор */}
      <section>
        <h2>{t("about.overview.title")}</h2>
        <p>{t("about.overview.intro")}</p>
        <p>{t("about.overview.goal")}</p>
        <p>{t("about.overview.mission")}</p>
      </section>

      {/* Раздел: Роли участников */}
      <section>
        <h2>{t("about.roles.title")}</h2>
        <ul>
          {t("about.roles.list", { returnObjects: true }).map((role, index) => (
            <li key={index}>
              <strong>{role.role}:</strong> {role.description}
            </li>
          ))}
        </ul>
      </section>

      {/* Раздел: Основные процессы */}
      <section>
        <h2>{t("about.processes.title")}</h2>
        <ul>
          {t("about.processes.list", { returnObjects: true }).map((process, index) => (
            <li key={index}>{process}</li>
          ))}
        </ul>
      </section>

      {/* Раздел: Цифровая система вознаграждений */}
      <section>
        <h2>{t("about.rewards.title")}</h2>
        <ul>
          {t("about.rewards.details", { returnObjects: true }).map((reward, index) => (
            <li key={index}>{reward}</li>
          ))}
        </ul>
      </section>

      {/* Раздел: Игровые элементы */}
      <section>
        <h2>{t("about.gamification.title")}</h2>
        <ul>
          {t("about.gamification.list", { returnObjects: true }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Раздел: Карта проекта */}
      <section>
        <h2>{t("about.map.title")}</h2>
        <p>{t("about.map.description")}</p>
        <ul>
          {t("about.map.details", { returnObjects: true }).map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </section>

      {/* Раздел: Технологическая и финансовая инфраструктура */}
      <section>
        <h2>{t("about.infrastructure.title")}</h2>
        <ul>
          {t("about.infrastructure.list", { returnObjects: true }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Раздел: Методы финансирования */}
      <section>
        <h2>{t("about.funding.title")}</h2>
        <ul>
          {t("about.funding.list", { returnObjects: true }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Раздел: Партнерские программы */}
      <section>
        <h2>{t("about.partnerships.title")}</h2>
        <ul>
          {t("about.partnerships.list", { returnObjects: true }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Раздел: Прозрачность и отчетность */}
      <section>
        <h2>{t("about.transparency.title")}</h2>
        <ul>
          {t("about.transparency.list", { returnObjects: true }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Раздел: Образовательные программы */}
      <section>
        <h2>{t("about.education.title")}</h2>
        <ul>
          {t("about.education.details", { returnObjects: true }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Раздел: PR и маркетинг */}
      <section>
        <h2>{t("about.marketing.title")}</h2>
        <ul>
          {t("about.marketing.details", { returnObjects: true }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Раздел: Инновации */}
      <section>
        <h2>{t("about.innovations.title")}</h2>
        <ul>
          {t("about.innovations.details", { returnObjects: true }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>

      {/* Раздел: Социальная сеть */}
      <section>
        <h2>{t("about.socialNetwork.title")}</h2>
        <ul>
          {t("about.socialNetwork.details", { returnObjects: true }).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AboutPage;
