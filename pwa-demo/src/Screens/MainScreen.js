import React, { useState, useEffect } from 'react';
import Map from '../Components/Map';
import Header from '../Components/Header/Header';

function MainScreen() {
  
  return (
    <div className="base-container">
      <Header/>
      <div className="container col center-all">     
        <Map />
      </div>
    </div>
  );
}

export default MainScreen;
