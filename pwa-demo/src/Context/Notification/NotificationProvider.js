import React, { useState, useCallback, useRef, useEffect } from 'react';
import NotificationContext from './NotificationContext';
import NotificationList from './NotificationList';

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id, message, type },
    ]);
    setIsVisible(true);
    resetTimer();
  }, []);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        setNotifications([]);
      }, 1000); // Ensure all notifications are shown for at least 3 seconds during fade-out
    }, 5000);
  };

  useEffect(() => {
    const handleOnline = () => {
      addNotification('You are back online!', 'success');
    };

    const handleOffline = () => {
      addNotification('You are offline! Your interactions will be stored.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check the initial online status
    if (!navigator.onLine) {
        handleOffline();
      }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {<NotificationList notifications={notifications} isVisible={isVisible} />}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;