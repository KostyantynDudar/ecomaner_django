
    <!-- Скрипт для работы кнопки MetaMask -->
<script>

// Скрипт для работы кнопки MetaMask
document.getElementById('registerButton').addEventListener('click', async () => {
    console.log("Нажата кнопка 'Вход через MetaMask'");
    
    // Проверяем, установлен ли MetaMask
    if (typeof window.ethereum !== 'undefined') {
        console.log("MetaMask найден. Запрашиваем доступ к кошелькам пользователя...");
        
        try {
            // Запрашиваем доступ к кошелькам пользователя
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const walletAddress = accounts[0];
            console.log(`Получен адрес кошелька: ${walletAddress}`);
            
            // Отправляем адрес кошелька на сервер
            console.log("Отправка адреса кошелька на сервер...");
            const response = await fetch('https://ecomaner.com:444/api/register-wallet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ wallet_address: walletAddress }),
            });
            
            console.log("Ожидание ответа от сервера...");
            const data = await response.json();
            console.log("Ответ от сервера получен:", data);

            if (data.success) {
                alert(data.message || 'Вход через MetaMask выполнен успешно!');
                localStorage.setItem('authToken', data.token); // Сохраняем токен в localStorage
                location.reload(); // Перезагрузка страницы
            } else {
                alert(data.message || 'Ошибка при регистрации MetaMask');
            }
        } catch (error) {
            console.error('Ошибка при подключении MetaMask:', error);
            alert('Не удалось подключиться к MetaMask');
        }
    } else {
        console.warn("MetaMask не установлен");
        alert('MetaMask не установлен. Пожалуйста, установите MetaMask для регистрации.');
    }
});



</script>

<script>
// Обработчик для кнопки "Регистрация по Email"
document.getElementById('emailRegisterButton').addEventListener('click', async () => {
    const email = prompt('Введите ваш Email для регистрации:');
    const password = prompt('Введите ваш пароль:');
    if (email && password) {
        try {
            const response = await fetch('https://ecomaner.com:444/api/register-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            alert(data.message || 'Регистрация успешна!');
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            alert('Ошибка при регистрации. Попробуйте снова.');
        }
    }
});
</script>


<script>
// Обработчик для кнопки "Вход по Email"
document.getElementById('emailLoginButton').addEventListener('click', async () => {
    const email = prompt('Введите ваш Email:');
    const password = prompt('Введите ваш пароль:');
    if (email && password) {
        try {
            const response = await fetch('https://ecomaner.com:444/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('authToken', data.token); // Сохраняем токен в localStorage
                alert(data.message || 'Вход выполнен успешно!');
                location.reload(); // Обновляем страницу, чтобы отобразить кнопку выхода
            } else {
                alert(data.message || 'Ошибка при входе');
            }
        } catch (error) {
            console.error('Ошибка при входе:', error);
            alert('Ошибка при входе. Попробуйте снова.');
        }
    }
});

</script>



