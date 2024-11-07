import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import Header from './components/Header';
import './styles/style.css';
import GameplayPage from './pages/GameplayPage'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/gameplay" element={<GameplayPage />} /> {/* Добавляем маршрут */}
        {/* Добавьте другие маршруты, если необходимо */}
      </Routes>
    </Router>
  );
}

console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);

export default App;
