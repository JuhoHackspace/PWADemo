import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LocationMarker from './LocationMarker';

export default function Map() {
  const [position, setPosition] = useState([65.0121, 25.4651]); // Default to Oulu, Finland
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    if(navigator.onLine) {
      // Get the user's current location
      navigator.geolocation.getCurrentPosition((position) => {
        const userPosition = [position.coords.latitude, position.coords.longitude];
        setPosition(userPosition); // Set the user's position
        setZoom(15); // Zoom in to the user's location
        console.log("User position: ", position.coords);

        localStorage.setItem('userPosition', JSON.stringify(userPosition));

        /*cacheMapTiles(position.coords.latitude, position.coords.longitude, 1000);*/
      });
    } else {
      const userPosition = JSON.parse(localStorage.getItem('userPosition'));
      if(userPosition) {
        console.log("User position from local storage: ", userPosition);
        setPosition(userPosition);
        setZoom(15);
      }
    }
  }, []);

  /*const cacheMapTiles = (lat, lon, radius) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('Service worker ready. Caching map tiles...');
        registration.active.postMessage({
          type: 'CACHE_MAP_TILES',
          lat,
          lon,
          radius,
        });
      });
    }
  };*/

  return (
    <MapContainer center={position} zoom={zoom} style={{ height: "400px", width: "100%" }}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker position={position} />
    </MapContainer>
  )
}
