import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LocationMarker from './LocationMarker';

export default function Map() {
  const [position, setPosition] = useState([65.0121, 25.4651]); // Default to Oulu, Finland
  const [zoom, setZoom] = useState(13);

  useEffect(() => {
    // Get the user's current location
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition([position.coords.latitude, position.coords.longitude]);
      setZoom(15); // Zoom in to the user's location
      console.log("User position: ", position.coords);
    });
  }, []);

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
