// frontend/src/components/GeoPhotoForm.js
import React, { useState } from 'react';
import axios from '../axiosSetup';
import '../styles/GeoPhotoForm.css'; // Подключаем стили

const GeoPhotoForm = ({ userEmail }) => {
  const [category, setCategory] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');

  const getCSRFToken = () => {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

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
    formData.append('photo', photo);
    formData.append('created_by', userEmail);

    const csrfToken = getCSRFToken();

    console.log('Отправляемые данные (FormData):');
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    const headers = {
      'Content-Type': 'multipart/form-data',
      'X-CSRFToken': csrfToken,
      Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    };

    console.log('Заголовки запроса:', headers);

    try {
      const response = await axios.post('/map/locations/', formData, { headers });

      console.log('Ответ сервера:', response.data);

      if (response.status === 201) {
        setMessage('Локация успешно сохранена!');
      }
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      console.error('Ответ сервера:', error.response?.data || error.message);
      setMessage('Ошибка при отправке данных: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="geo-photo-form">
      <h3>Добавить локацию</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Категория:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Выберите категорию</option>
            <option value="waste_dump">Свалка</option>
            <option value="recycling_point">Пункт приема</option>
          </select>
        </div>
        <div className="form-group">
          <label>Описание:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Добавьте описание"
          />
        </div>
        <div className="form-group">
          <label>Фото:</label>
          <input type="file" onChange={handlePhotoChange} />
        </div>
        <div className="form-group">
          <label>Координаты:</label>
          <button type="button" onClick={getGeolocation}>
            Получить геолокацию
          </button>
          <p>Широта: {latitude}</p>
          <p>Долгота: {longitude}</p>
        </div>
        <button type="submit">Отправить</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default GeoPhotoForm;
