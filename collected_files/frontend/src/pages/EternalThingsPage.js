// src/pages/EternalThingsPage.js
import React from 'react';
import '../styles/EternalThings.css';

const EternalThingsPage = () => {
    return (
        <main className="eternal-things">
            <header>
                <h1>Экоманер</h1>
                <h2>Вечные вещи</h2>
                <p>Концепция "Вечных вещей" в проекте Экоманер представляет собой инновационный подход к переработке отходов, создающий долговечные и ценные продукты, служащие людям десятилетиями. Эти предметы производятся из переработанных материалов и становятся не только полезными, но и экологически безопасными.</p>
            </header>

            <section className="section">
                <h3>Что такое вечные вещи?</h3>
                <p>Вечные вещи — это продукты длительного использования, созданные из переработанного мусора, которые рассчитаны на долгий срок службы. В отличие от традиционных изделий, вечные вещи сохраняют свою ценность на протяжении многих лет и подлежат восстановлению и повторному использованию.</p>
            </section>

            <section className="section">
                <h3>Примеры вечных вещей</h3>

                <div className="item" id="tile">
                    <h4>Тротуарная плитка из переработанного мусора</h4>
                    <p>Производится из переработанных материалов и устойчива к нагрузкам и погодным условиям. Используется в благоустройстве, минимизируя использование новых ресурсов для дорожного покрытия.</p>
                </div>

                <div className="item" id="trash-bins">
                    <h4>Ящики для мусора</h4>
                    <p>Долговечные мусорные контейнеры, сделанные из переработанных пластиковых материалов, помогают поддерживать чистоту в городах и служат долгие годы, что снижает количество производимых отходов.</p>
                </div>

                <div className="item" id="road-modules">
                    <h4>Модули для укладки дорог</h4>
                    <p>Изготовлены из переработанного мусора и применяются для покрытия дорог и тротуаров. Эти модули устойчивы к износу и не требуют частого обновления.</p>
                </div>

                <div className="item" id="bags">
                    <h4>Авоськи из пластиковых цепочек</h4>
                    <p>Эти прочные авоськи производятся из переработанного пластика, заменяя одноразовые пакеты. Они долговечны и подходят для многоразового использования.</p>
                </div>

                <div className="item" id="visiting-cards">
                    <h4>Влагоустойчивые визитки</h4>
                    <p>Производятся из переработанных материалов с влагозащитой. Визитки долговечны, износостойки и сохраняют презентабельный вид даже в условиях высокой влажности.</p>
                </div>

                <div className="item" id="one-world-futbol">
                    <h4>One World Futbol</h4>
                    <p>Футбольный мяч, созданный для длительного использования, не нуждается в накачке и рассчитан на игры в самых суровых условиях. Идеально подходит для использования в общественных пространствах и образовательных программах.</p>
                </div>

                <div className="item" id="smartphone-protection">
                    <h4>Защита для смартфонов и противоударное стекло</h4>
                    <p>Эти долговечные защитные изделия обеспечивают смартфонам дополнительную защиту, сохраняя устройства в целости и снижая потребность в замене аксессуаров.</p>
                </div>
            </section>

            <section className="section">
                <h3>Экологическое и экономическое значение вечных вещей</h3>
                <p>Вечные вещи помогают снизить объём отходов и стимулируют экономику переработки. Такие предметы служат долго, что уменьшает необходимость в их замене и снижает нагрузку на природу за счёт уменьшения производства одноразовых товаров. Использование вечных вещей также способствует созданию рабочих мест в области переработки и повышению ценности отходов как ресурса.</p>
                <p>Каждая из вечных вещей стоит дороже, чем обычная продукция из вторсырья, подчеркивая их уникальность и высокое качество. В рамках игры игроки могут выпускать NFT для каждой вечной вещи, открывая возможности для создания новых видов долговечных товаров.</p>
            </section>
        </main>
    );
};

export default EternalThingsPage;