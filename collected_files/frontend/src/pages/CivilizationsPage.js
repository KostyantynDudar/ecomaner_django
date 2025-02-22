// src/pages/CivilizationsPage.js
import React from 'react';
import '../styles/Civilizations.css';

const CivilizationsPage = () => {
    return (
        <main className="civilizations">
            <header>
                <h1>Экоманер</h1>
                <h2>Игровые цивилизации</h2>
                <p>Каждая цивилизация в проекте Экоманер имеет уникальную роль и функции, способствующие достижению экологических целей. Ниже представлены основные цивилизации и их обязанности.</p>
            </header>

            <section className="civilization-section">
                <div className="civilization" id="bees">
                    <h4>Цивилизация Пчел</h4>
                    <p><strong>Роль:</strong> Сбор и сортировка мусора.</p>
                    <p>Цивилизация Пчел занимается сбором и сортировкой мусора, освобождая жизненное пространство. Как в реальной жизни, пчелы трудолюбиво работают над тем, чтобы собирать отходы и направлять их в пункты переработки. Участники могут инициировать строительство сортировочных станций, которые увеличат очки цивилизации Пчел.</p>
                    <img src="../images/bees.jpg" alt="Цивилизация Пчел" />
                </div>

                <div className="civilization" id="ants">
                    <h4>Цивилизация Муравьев</h4>
                    <p><strong>Роль:</strong> Переработка и утилизация мусора.</p>
                    <p>Муравьи ответственны за переработку отсортированного мусора, превращая его в сырьё для производства или вторичные материалы. Они также могут производить электроэнергию и тепло из органических отходов. В городах и сотах могут строиться заводы по переработке мусора, поддерживаемые цивилизацией Муравьев.</p>
                    <img src="../images/ants.jpg" alt="Цивилизация Муравьев" />
                </div>

                <div className="civilization" id="fungi">
                    <h4>Цивилизация Грибов</h4>
                    <p><strong>Роль:</strong> Коммуникация и распространение информации.</p>
                    <p>Цивилизация Грибов занимается распространением экологических знаний, поддержкой миссий и обучением участников. Грибы создают информационное поле для обмена ресурсами и навыками между участниками, помогая каждому найти своё место в экосистеме Экоманер.</p>
                    <img src="../images/fungi.jpg" alt="Цивилизация Грибов" />
                </div>

                <div className="civilization" id="bacteria">
                    <h4>Цивилизация Бактерий</h4>
                    <p><strong>Роль:</strong> Производство энергии и гумуса из органических отходов.</p>
                    <p>Бактерии перерабатывают органические отходы, превращая их в полезные ресурсы, такие как энергия, тепло и гумус для почвы. Это поддерживает экологический баланс, уменьшая объём отходов и создавая новые источники энергии.</p>
                    <img src="../images/bacteria.jpg" alt="Цивилизация Бактерий" />
                </div>
            </section>
        </main>
    );
};

export default CivilizationsPage;
