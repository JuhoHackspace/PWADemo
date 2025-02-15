import React, { useState, useEffect } from 'react';
import NotificationProvider from './Context/Notification/NotificationProvider';
import MainScreen from './Screens/MainScreen';
import './App.css';
function App() {
  return (
    <NotificationProvider>
      <MainScreen />
    </NotificationProvider>
  );
}

export default App;
