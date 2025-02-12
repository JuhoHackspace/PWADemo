import React, { useState, useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import marker from '../Assets/marker.png';

// Define a custom icon
const customIcon = new L.Icon({
    iconUrl: marker, // Specify the icon image URL
    iconSize: [40, 32], // Size of the icon
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
});

function LocationMarker({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 15); // Set the view to the new position with zoom level 15
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} icon={customIcon}>
      <Popup>You are here.</Popup>
    </Marker>
  );
}

export default LocationMarker;