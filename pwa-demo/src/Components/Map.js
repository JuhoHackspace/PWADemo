import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LocationMarker from './LocationMarker';
import { openDB } from 'idb';
import useNotification from '../Context/Notification/UseNotification';

export default function Map() {
  const [position, setPosition] = useState([65.0121, 25.4651]); // Default to Oulu, Finland
  const [zoom, setZoom] = useState(13);
  const [locations, setLocations] = useState([]);
  const { addNotification } = useNotification();
  const [markerPlacementEnabled, setMarkerPlacementEnabled] = useState(false);

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

  const addLocation = async (location) => {
      try {
        try {
          const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/locations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(location),
          });
          const data = await response.text();
          console.log("Location added: ", data);
          addNotification("Location added!", "success");
        } catch(error) {
          console.error("Error adding location: ", error);
        }
        if(!navigator.onLine) {
          await addLocationsToIDB([location]);
          addNotification("Location added! Will be synced once online.", "info");
          getLocationsFromIDB();
        }else {
          await getLocations(); // Fetch the latest locations
        }
      } catch(error) {
        console.error("Error adding location: ", error);
        addNotification("Error adding location!", "error");
      }
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
  const getLocations = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/locations`);
      const data = await response.json();
      console.log("Locations: ", data);
      setLocations(data);
      addLocationsToIDB(data);
    } catch(error) {
      console.error("Error fetching locations: ", error);
    }
  };

  const addLocationsToIDB = async (locations) => {
    const db = await openDB('locations-db', 1, {
      upgrade(db) {
        const store = db.createObjectStore('locations', {
          keyPath: 'id',
          autoIncrement: true,
        });
        store.createIndex('latitude', 'latitude');
        store.createIndex('longitude', 'longitude');
        store.createIndex('description', 'description');
      },
    });

    const tx = db.transaction('locations', 'readwrite');
    const store = tx.objectStore('locations');

    for (const location of locations) {
      const id = hashLocation(location.latitude, location.longitude);
      const existingLocation = await store.get(id);
      if (!existingLocation) {
        await store.add({ ...location, id });
      }
    }

    await tx.done;
  };
  
  const getLocationsFromIDB = async () => {
    const db = await openDB('locations-db', 1);
    const tx = db.transaction('locations', 'readonly');
    const store = tx.objectStore('locations');
    const allLocations = await store.getAll();
    console.log("Locations from IDB: ", allLocations);
    setLocations(allLocations);
  }

  useEffect(() => {
    // Check if the user is online
    if(navigator.onLine) {
      getLocations(); // Fetch locations from the backend
    } else {
      getLocationsFromIDB(); // Fetch locations from the IndexedDB
    }
  }, []);
  
  useEffect(() => {
    // Set up an event listener to handle messages from the service worker
    const handleOnline = () => {
      getLocations();
    };

    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('Received sync message from service worker', event.data);
      if (event.data.type === 'SYNC_COMPLETE') {
        handleOnline(); // When the background sync is complete, fetch the latest locations
      }
    });
  }, []);

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