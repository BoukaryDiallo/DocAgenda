import React, {createContext, useContext, useState, useEffect, useCallback} from 'react';
import {getNotificationsCount} from '../api';
import {useAuthContext} from './AuthContext';

const NotificationContext = createContext({nonLues: 0, rafraichir: () => {}});

export function NotificationProvider({children}) {
  const {user} = useAuthContext();
  const [nonLues, setNonLues] = useState(0);

  const rafraichir = useCallback(async () => {
    if (!user) {
      setNonLues(0);
      return;
    }
    try {
      const data = await getNotificationsCount();
      setNonLues(data.total);
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    rafraichir();
    const interval = setInterval(rafraichir, 30000);
    return () => clearInterval(interval);
  }, [rafraichir]);

  return (
    <NotificationContext.Provider value={{nonLues, rafraichir}}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  return useContext(NotificationContext);
}
