import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import Header from './components/Header';
import './styles/style.css';
import GameplayPage from './pages/GameplayPage'
import HowItWorksPage from './pages/HowItWorksPage';
import FaqPage from './pages/FaqPage';
import ParticipationPage from './pages/ParticipationPage'; 
import CivilizationsPage from './pages/CivilizationsPage';
import EternalThingsPage from './pages/EternalThingsPage';
import ContactPage from './pages/ContactPage';
import NewsList from './components/NewsList';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gameplay" element={<GameplayPage />} /> 
        <Route path="/how-it-works" element={<HowItWorksPage />} /> 
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/join" element={<ParticipationPage />} />
        <Route path="/civilizations" element={<CivilizationsPage />} />
        <Route path="/eternal-things" element={<EternalThingsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/news" element={<NewsList />} />
        {/* Добавьте другие маршруты, если необходимо */}
      </Routes>
    </Router>
  );
}

console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);

export default App;
