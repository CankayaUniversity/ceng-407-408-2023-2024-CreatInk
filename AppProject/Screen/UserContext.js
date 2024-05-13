import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState('');

  const storeUserId = async (id) => {
    try {
      await AsyncStorage.setItem('user_id', id);
      setUserId(id);
    } catch (error) {
      console.error('Failed to store user_id in AsyncStorage:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userId, setUserId: storeUserId }}>
      {children}
    </UserContext.Provider>
  );
};
