import React, { useState, useEffect } from 'react';
import NotificationProvider from './Context/Notification/NotificationProvider';
import LocationsProvider from './Context/Locations/LocationsProvider';
import MainScreen from './Screens/MainScreen';
import './App.css';

function App() {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(true);

  useEffect(() => {
    // Capture the install prompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent automatic prompt
      e.preventDefault();
      // Store the event so we can trigger the prompt later
      setInstallPromptEvent(e);
    });

    // Listen for the appinstalled event to know when the app has been installed
    window.addEventListener('appinstalled', () => {
      console.log('App installed!');
    });
  }, []);
  
  // Hide the install button in PWA mode
  useEffect(() => {
    const checkStandaloneMode = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setShowInstallButton(false);
      } else {
        setShowInstallButton(true);
      }
    };
    checkStandaloneMode();

    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkStandaloneMode);

    return () => {
      window.matchMedia('(display-mode: standalone)').removeEventListener('change', checkStandaloneMode);
    };
  }, []);

  // Handle the install button click
  const handleInstallClick = () => {

    if (installPromptEvent) {
      installPromptEvent.prompt(); // Show the install prompt
      installPromptEvent.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setInstallPromptEvent(null); // Clear the prompt
      });
    } else {
      alert('The app is already installed.');
    }
  };

  return (
    <NotificationProvider>
      <LocationsProvider>
        {showInstallButton && 
          <button
            onClick={handleInstallClick}
            id="install-button"
            className="inner-05em"
          >Install App
          </button>
        }
        <MainScreen />
      </LocationsProvider>
    </NotificationProvider>
  );
}

export default App;
