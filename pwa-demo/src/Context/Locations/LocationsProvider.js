import React, { useState, useEffect } from 'react'
import LocationsContext from './LocationsContext'
import useNotification from '../Notification/UseNotification';
import { openDB } from 'idb';

const LocationsProvider = ({children}) => {
    const [locations, setLocations] = useState([]);
    const { addNotification } = useNotification();
  
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
  
    const getLocations = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/locations`);
        const data = await response.json();
        console.log("Locations: ", data);
        setLocations(data);
        addLocationsToIDB(data);
      } catch(error) {
        console.error("Error fetching locations: ", error);
        addNotification("Error connecting to the server", "error");
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

  return (
    <LocationsContext.Provider value={{addLocation, locations}}>
      {children}
    </LocationsContext.Provider>
  )
}

export default LocationsProvider;