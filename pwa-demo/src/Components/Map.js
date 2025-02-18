import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LocationMarker from './LocationMarker';
import UseLocations from '../Context/Locations/UseLocations';

export default function Map() {
  const [position, setPosition] = useState([65.0121, 25.4651]); // Default to Oulu, Finland
  const [zoom, setZoom] = useState(13);
  const [markerPlacementEnabled, setMarkerPlacementEnabled] = useState(false);
  const { locations, addLocation } = UseLocations();

  useEffect(() => {
    if(navigator.onLine) {
      // Get the user's current location
      navigator.geolocation.getCurrentPosition((position) => {
        const userPosition = [position.coords.latitude, position.coords.longitude];
        setPosition(userPosition); // Set the user's position
        setZoom(15); // Zoom in to the user's location
        console.log("User position: ", position.coords);

        localStorage.setItem('userPosition', JSON.stringify(userPosition));

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

    // Hashing function to create a unique ID based on latitude and longitude
  const hashLocation = (latitude, longitude) => {
    return `${Number(latitude).toFixed(6)}_${Number(longitude).toFixed(6)}`;
  };

  const hanleMapClick = (event) => {
    if(markerPlacementEnabled) {
      const { lat, lng } = event.latlng;
      const location = {
        latitude: lat,
        longitude: lng,
        description: prompt("Enter a description for the location:")
      };
      addLocation(location);
    }
  }
  
  const MapClickHandler = () => {
    useMapEvents({
      click: hanleMapClick
    });
  }

  return (
    <>
    <button onClick={() => setMarkerPlacementEnabled(!markerPlacementEnabled)}>
      {markerPlacementEnabled ? "Cancel" : "Add location"}
    </button>
    <MapContainer center={position} zoom={zoom} style={{ height: "400px", width: "100%" }}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        <LocationMarker position={position} description="You are here." isUserLocation={true} />
        {locations.length > 0 && locations.map((location, index) => (
          <LocationMarker key={index} position={[location.latitude, location.longitude]} description={location.description} isUserLocation={false} />
        ))}
    </MapContainer>
    </>
  )
}