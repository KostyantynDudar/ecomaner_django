import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Маршрут для главной страницы */}
        <Route path="/" element={<HomePage />} />
        {/* Другие маршруты можно добавить здесь */}
      </Routes>
    </Router>
  );
}
console.log("API Base URL:", process.env.REACT_APP_API_BASE_URL);

export default App;
