import React, { useState, useCallback, useRef, useEffect } from 'react';
import NotificationContext from './NotificationContext';
import NotificationList from './NotificationList';
import NavigatorStatus from './NavigatorStatus';

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef(null);
  const timerRef2 = useRef(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

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
    }if(timerRef2.current) {
      clearTimeout(timerRef2.current);
    }
    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      timerRef2.current = setTimeout(() => {
        setNotifications([]);
      }, 1000); // Ensure all notifications are shown for at least 3 seconds during fade-out
    }, 5000);
  };

  useEffect(() => {
    const handleOnline = () => {
      addNotification('You are back online!', 'success');
      setIsOnline(true);
    };

    const handleOffline = () => {
      addNotification('You are offline! Your interactions will be stored.', 'warning');
      setIsOnline(false);
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

  useEffect(() => {
    const handleQueuedInteractions = (event) => {
      if (event.data.size > 0) {
        addNotification(`${event.data.size} interaction${event.data.size > 1 ? 's' : ''} queued.`, 'info');
      }
    }

    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Received queue message from service worker', event.data);
      if (event.data.type === 'QUEUE_SIZE') {
        handleQueuedInteractions(event);
      }
    })
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Received sync message from service worker', event.data);
      if (event.data.type === 'SYNC_COMPLETE') {
        addNotification('Data synced successfully!', 'success');
      }
    })
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Received sync message from service worker', event.data);
      if (event.data.type === 'SYNC_INTERRUPTED') {
        addNotification('Sync interrupted. Resuming once online.', 'warning');
      }
    })

  }, []);
  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <NavigatorStatus isOnline={isOnline} />
      {<NotificationList notifications={notifications} isVisible={isVisible} />}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;