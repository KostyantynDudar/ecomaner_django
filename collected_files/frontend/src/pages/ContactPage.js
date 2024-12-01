import React from 'react';
import '../styles/Contact.css';

const ContactPage = () => {
    return (
        <main className="contact">
            <header>
                <h1>Экоманер</h1>
                <h2>Контакты</h2>
                <p>Свяжитесь с нами по электронной почте или в социальных сетях. Мы стремимся отвечать на все ваши вопросы и стараемся обрабатывать каждое сообщение как можно быстрее. Ваше мнение и идеи важны для нас!</p>
            </header>

            <section className="section">
                <h3>Наши контакты</h3>

                <div className="contact-info">
                    <p><strong>Email:</strong> <a href="mailto:ecomaner@gmail.com">ecomaner@gmail.com</a></p>
                </div>

                <div className="contact-info">
                    <p><strong>Twitter:</strong> <a href="https://x.com/ecomaner" target="_blank">https://x.com/ecomaner</a></p>
                </div>

                <div className="contact-info">
                    <p><strong>Discord:</strong> <a href="https://discord.com/channels/935569452861370449/935569452861370452" target="_blank">Присоединиться к нашему Discord</a></p>
                </div>
            </section>
        </main>
    );
};

export default ContactPage;
