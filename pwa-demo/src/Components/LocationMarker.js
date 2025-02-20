import React, { useState, useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import marker from '../Assets/marker.png';
import marker2 from '../Assets/marker2.png';

function LocationMarker({ position, description, isUserLocation, onClickHandler }) {
  const map = useMap();
  const markerRef = useRef(null);

  // Define a custom icon
  const customIcon = new L.Icon({
    iconUrl: isUserLocation ? marker : marker2, // Use the preloaded icon images
    iconSize: [40, 32], // Size of the icon
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
  });


  useEffect(() => {
    if (position && isUserLocation) {
      map.setView(position, 15); // Set the view to the new position with zoom level 15
    }
  }, [position, map]);

  useEffect(() => {
    if (markerRef.current && isUserLocation) {
      markerRef.current.setZIndexOffset(1000); // Set z-index to 1000 for user location marker
    }
  }, [isUserLocation]);

  return position === null ? null : (
    <Marker 
      position={position} 
      icon={customIcon} 
      ref={markerRef} 
      eventHandlers={{
        click: (e) => {
          e.originalEvent.stopPropagation(); // Prevent the map click event from firing
          onClickHandler();
        }
      }}
    >
      <Popup>{description}</Popup>
    </Marker>
  );
}

export default LocationMarker;