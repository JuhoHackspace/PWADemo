import React, { useState, useEffect } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import marker from '../Assets/marker.png';
import marker2 from '../Assets/marker2.png';

function LocationMarker({ position, description, isUserLocation }) {
  const map = useMap();

    // Define a custom icon
  const customIcon = new L.Icon({
    iconUrl: isUserLocation ? marker: marker2, // Specify the icon image URL
    iconSize: [40, 32], // Size of the icon
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
  });

  useEffect(() => {
    if (position && isUserLocation) {
      map.setView(position, 15); // Set the view to the new position with zoom level 15
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} icon={customIcon}>
      <Popup>{description}</Popup>
    </Marker>
  );
}

export default LocationMarker;