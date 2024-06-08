import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({

    userId: '',
    email: '',
    password: '',
    name: '',

  });

  const storeUserData = async (data) => {
    try {
      const entries = Object.entries(data).filter(([key, value]) => value != null);
      const stringEntries = entries.map(([key, value]) => [key, String(value)]);
      await AsyncStorage.multiSet(stringEntries);
      setUserData(data);
    } catch (error) {
      console.error('Failed to store user data in AsyncStorage:', error);
    }
  };

  return (
    <UserContext.Provider value={{ userData, setUserData: storeUserData }}>
      {children}
    </UserContext.Provider>
  );
};