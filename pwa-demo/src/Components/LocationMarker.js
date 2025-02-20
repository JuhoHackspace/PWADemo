import React, { useState, useEffect, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import marker from '../Assets/marker.png';
import marker2 from '../Assets/marker2.png';

function LocationMarker({ position, description, isUserLocation, onClickHandler }) {
  const map = useMap();
  const markerRef = useRef(null);
  const [iconsLoaded, setIconsLoaded] = useState(false);
  const [icon1, setIcon1] = useState(null);
  const [icon2, setIcon2] = useState(null);

  useEffect(() => {
    const loadIcons = () => {
      const img1 = new Image();
      const img2 = new Image();
      let loadedCount = 0;

      const handleLoad = () => {
        loadedCount += 1;
        if (loadedCount === 2) {
          setIconsLoaded(true);
        }
      };

      img1.src = marker;
      img2.src = marker2;

      img1.onload = () => {
        handleLoad();
        setIcon1(img1.src);
      };
      img2.onload = () => {
        handleLoad();
        setIcon2(img2.src);
      };
    };

    loadIcons();
  }, []);

  // Define a custom icon
  const customIcon = new L.Icon({
    iconUrl: isUserLocation ? icon1 : icon2, // Use the preloaded icon images
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

  if (!iconsLoaded) {
    return null; // Don't render the marker until the icons are loaded
  }

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