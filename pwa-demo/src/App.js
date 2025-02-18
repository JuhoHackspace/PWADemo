import React, { useState, useEffect } from 'react';
import NotificationProvider from './Context/Notification/NotificationProvider';
import LocationsProvider from './Context/Locations/LocationsProvider';
import MainScreen from './Screens/MainScreen';
import './App.css';

function App() {
  return (
    <NotificationProvider>
      <LocationsProvider>
        <MainScreen />
      </LocationsProvider>
    </NotificationProvider>
  );
}

export default App;
