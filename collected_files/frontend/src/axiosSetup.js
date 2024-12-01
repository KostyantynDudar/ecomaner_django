// src/axiosSetup.js
import axios from 'axios';

// Устанавливаем базовый URL для всех запросов API
const instance = axios.create({
  baseURL: 'https://ecomaner.com/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true, // добавляем чтобы куки отправлялись с запросом

});

export default instance;
