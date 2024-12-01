import React, { useEffect, useState } from 'react';
import axios from '../axiosSetup';

const AccountPage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/accounts/profile/');
        setUserData(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных пользователя:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h2>Личный кабинет</h2>
      <p>Имя: {userData.name || "Имя не указано"}</p>
      <p>Email: {userData.email || "Email не указан"}</p>
    </div>
  );
};

export default AccountPage;
