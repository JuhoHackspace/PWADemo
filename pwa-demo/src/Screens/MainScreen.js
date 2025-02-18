import React, { useState, useEffect } from 'react';
import { openDB } from 'idb';
import Map from '../Components/Map';
import useNotification from '../Context/Notification/UseNotification';

function MainScreen() {
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  const [queueSize, setQueueSize] = useState(0);
  const { addNotification } = useNotification();
  
  const sendData = () => {
    console.log('Sending data', text);
    console.log('Backend URL', process.env.REACT_APP_BACKEND_URL);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        string: text,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        setData((prevData) => [...prevData, data]);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  useEffect(() => {
    const fetchResponses = async () => {
      const db = await openDB('responses-db', 1);
      const tx = db.transaction('responses', 'readonly');
      const store = tx.objectStore('responses');
      const allResponses = await store.getAll();
      const responseData = allResponses.map((item) => item.response);
      setData((currentData) => [...currentData, ...responseData]);

      // Clear the object store after retrieving the items
      await store.clear();
      await tx.done;
    };

    const handleSyncComplete = async (event) => {
      if (event.data && event.data.type === 'SYNC_COMPLETE') {
        fetchResponses();
      }
    };

    const handleQueueSize = (event) => {
      if (event.data && event.data.type === 'QUEUE_SIZE') {
        setQueueSize(event.data.size);
      }
    };

    navigator.serviceWorker.addEventListener('message', handleSyncComplete);
    navigator.serviceWorker.addEventListener('message', handleQueueSize);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleSyncComplete);
      navigator.serviceWorker.removeEventListener('message', handleQueueSize)
    };
  }, []);
  
  const handleButtonClick = () => {
    addNotification('This is an info notification!', 'info');
  }
  
  return (
    <div className="base-container">
      <div className="container col center-all">
        <div className="">
            <h1>Map application</h1>
        </div>      
        <Map />
      </div>
    </div>
  );
}

export default MainScreen;
