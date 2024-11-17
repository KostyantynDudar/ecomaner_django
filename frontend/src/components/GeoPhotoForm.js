// frontend/src/components/GeoPhotoForm.js
import React, { useState } from 'react';
import axios from '../axiosSetup';

const GeoPhotoForm = ({ userEmail }) => {
  const [category, setCategory] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null); // Добавляем стейт для фото
  const [message, setMessage] = useState('');

  // Обработчик для выбора файла
  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  // Получение геолокации
  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          setMessage('Ошибка при получении геолокации: ' + error.message);
        }
      );
    } else {
      setMessage('Геолокация не поддерживается вашим браузером');
    }
  };

  // Отправка данных на сервер
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !latitude || !longitude) {
      setMessage('Заполните все поля перед отправкой!');
      return;
    }

    const formData = new FormData();
    formData.append('type', category);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('description', description);
    formData.append('photo', photo); // Добавляем фото
    formData.append('created_by', userEmail); // Добавляем email
    console.log('Полученный userEmail в GeoPhotoForm:', userEmail);

    try {
      const token = localStorage.getItem('access_token'); // Получаем токен из localStorage
      if (!token) {
        setMessage('Токен аутентификации отсутствует!');
        return;
      }

      const response = await axios.post('/map/locations/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Добавляем токен в заголовки
        },
      });

      if (response.status === 201) {
        setMessage('Локация успешно сохранена!');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных:', error.response || error.message);
      setMessage('Ошибка при отправке данных: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div>
      <h3>Добавить локацию</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Категория:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Выберите категорию</option>
            <option value="waste_dump">Свалка</option>
            <option value="recycling_point">Пункт приема</option>
          </select>
        </div>
        <div>
          <label>Описание:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Добавьте описание"
          />
        </div>
        <div>
          <label>Фото:</label>
          <input type="file" onChange={handlePhotoChange} />
        </div>
        <div>
          <label>Координаты:</label>
          <button type="button" onClick={getGeolocation}>
            Получить геолокацию
          </button>
          <p>Широта: {latitude}</p>
          <p>Долгота: {longitude}</p>
        </div>
        <button type="submit">Отправить</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default GeoPhotoForm;
