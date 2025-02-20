import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LocationMarker from './LocationMarker';
import UseLocations from '../Context/Locations/UseLocations';

export default function Map() {
  const [position, setPosition] = useState([65.0121, 25.4651]); // Default to Oulu, Finland
  const [zoom, setZoom] = useState(13);
  const [markerPlacementEnabled, setMarkerPlacementEnabled] = useState(false);
  const { locations, addLocation, removeLocation } = UseLocations();
  const [markerRemovalEnabled, setMarkerRemovalEnabled] = useState(false);

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
        id: hashLocation(lat, lng),
        data: {
          latitude: lat,
          longitude: lng,
          description: prompt("Enter a description for the location:")
        }
      };
      addLocation(location);
    }
  }
  
  const MapClickHandler = () => {
    useMapEvents({
      click: hanleMapClick
    });
  }

  const handelRemoveButtonClick = () => {
    setMarkerRemovalEnabled(!markerRemovalEnabled);
    if(markerPlacementEnabled) {
      setMarkerPlacementEnabled(false);
    }
  }

  const handleAddButtonClick = () => {
    setMarkerPlacementEnabled(!markerPlacementEnabled);
    if(markerRemovalEnabled) {
      setMarkerRemovalEnabled(false);
    }
  }

  return (
    <>
    <span className="inner-1em text-center min-h-100">
      <p>Add or remove locations</p>
      <p>
        {markerPlacementEnabled && "Click on the map to add a location."}
        {markerRemovalEnabled && "Click on a location to remove it."}
      </p>
    </span>
    <div className="inner-1em row">
      <button 
        className={`button ${markerPlacementEnabled ? "button-secondary" : ""}`} 
        onClick={handleAddButtonClick}
      >
        Add Location
      </button>
      <button 
        className={`button ${markerRemovalEnabled ? "button-secondary" : ""}`} 
        onClick={handelRemoveButtonClick}
      >
        Remove Location
      </button>
    </div>
    <MapContainer center={position} zoom={zoom} style={{ height: "400px", width: "100%" }}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        <LocationMarker position={position} description="You are here." isUserLocation={true} />
        {locations.length > 0 && locations.map((location, index) => (
          <LocationMarker 
            key={index} 
            position={[location.data.latitude, location.data.longitude]} 
            description={location.data.description} 
            isUserLocation={false} 
            onClickHandler={() => {
              if(markerRemovalEnabled) {
                removeLocation(location)
              }
            }}
          />
        ))}
    </MapContainer>
    </>
  )
}