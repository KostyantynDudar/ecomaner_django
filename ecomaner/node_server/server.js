// server.js

const express = require('express');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Загрузка конфигурации из .env файла
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Пул подключений к базе данных
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Функция генерации JWT токена
function generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Эндпоинт для регистрации пользователя по email и паролю
app.post('/api/register-email', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Проверка, существует ли уже пользователь с таким email
        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Пользователь уже зарегистрирован' });
        }

        // Хэширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание нового пользователя
        const result = await pool.query(
            'INSERT INTO users (email, password, created_at) VALUES ($1, $2, NOW()) RETURNING id',
            [email, hashedPassword]
        );

        const newUser = result.rows[0];
        const token = generateToken(newUser.id); // Генерация токена для нового пользователя
        res.json({ success: true, message: 'Успешная регистрация!', token, user: { id: newUser.id, email } });
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Эндпоинт для входа в систему
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Проверка, существует ли пользователь с таким email
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({ success: false, message: 'Неверный email или пароль' });
        }

        const user = userResult.rows[0];

        // Проверка пароля
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: 'Неверный email или пароль' });
        }

        // Генерация токена при успешной аутентификации
        const token = generateToken(user.id);
        res.json({ success: true, message: 'Успешный вход!', token, user: { id: user.id, email } });
    } catch (error) {
        console.error('Ошибка при входе:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Эндпоинт для регистрации через MetaMask
app.post('/api/register-wallet', async (req, res) => {
    const { wallet_address } = req.body;
    console.log(`Получен запрос на регистрацию: ${wallet_address}`);

    try {
        // Проверка, существует ли уже такой пользователь
        const existingUser = await pool.query('SELECT * FROM users WHERE wallet_address = $1', [wallet_address]);
        
        if (existingUser.rows.length > 0) {
            // Если пользователь уже существует, генерируем токен для него
            const token = generateToken(existingUser.rows[0].id);
            console.log('Пользователь уже существует:', existingUser.rows[0]);
            return res.json({ success: true, message: 'Пользователь уже авторизован', token, user: existingUser.rows[0] });
        }

        // Создание нового пользователя
        const result = await pool.query(
            'INSERT INTO users (wallet_address, created_at) VALUES ($1, NOW()) RETURNING id',
            [wallet_address]
        );

        const newUser = result.rows[0];
        const token = generateToken(newUser.id); // Генерация токена для нового пользователя
        console.log('Новый пользователь создан:', newUser);
        res.json({ success: true, message: 'Успешная регистрация!', token, user: newUser });
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});

// Middleware для проверки токена
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // Если нет токена, возвращаем ошибку 401

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Ошибка проверки токена - 403 Forbidden
        req.user = user;
        next();
    });
}

// API-эндпоинт для личного кабинета (только для авторизованных пользователей)
app.get('/api/user-info', authenticateToken, async (req, res) => {
    try {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.userId]);
        if (user.rows.length > 0) {
            res.json({ success: true, user: user.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'Пользователь не найден' });
        }
    } catch (error) {
        console.error('Ошибка получения информации о пользователе:', error);
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});


// Маршрут для получения списка эндпоинтов
app.get('/api/endpoints', (req, res) => {
    const routes = [];
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            const method = Object.keys(middleware.route.methods)[0].toUpperCase();
            const path = middleware.route.path;
            routes.push({ method, path });
        }
    });
    res.json(routes);
});

// API-эндпоинт для получения данных о фото и локациях свалок
app.get('/api/photo-locations', async (req, res) => {
    try {
        console.log('Запрос к /api/photo-locations'); // Добавлен лог
        const result = await pool.query('SELECT id, lat_id AS latitude, long_id AS longitude, comments FROM photo');
        console.log('Результат запроса:', result.rows); // Лог результатов запроса
        res.json(result.rows);
    } catch (error) {
        console.error('Ошибка при получении данных о локациях:', error); // Лог ошибки
        res.status(500).json({ success: false, message: 'Ошибка сервера' });
    }
});



app.post('/api/logout', authenticateToken, (req, res) => {
    // Просто возвращаем успешный ответ, чтобы клиент удалил токен
    res.json({ success: true, message: 'Выход выполнен успешно' });
});


// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
