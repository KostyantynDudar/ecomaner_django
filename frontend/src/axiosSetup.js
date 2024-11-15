// src/axiosSetup.js
import axios from 'axios';

// Получаем CSRF-токен из мета-тега
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Настраиваем Axios для автоматического добавления CSRF-токена
axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export default axios;