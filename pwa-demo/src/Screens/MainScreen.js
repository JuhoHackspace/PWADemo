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
        <div className="header text-center">
            <h1>Map application</h1>
        </div>
        <div className="container center-all row"> 
          <div className="cntr-200-w cntr-h-cnt col center-all">
            <h1>Enter string</h1>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
            <button className="outer-1em" onClick={sendData}>Send</button>
            <div className="inner-1em">There are {queueSize} requests queued.</div>
            <h1>Response</h1>
            <div className="inner-1em">
              {data.length > 0 && data.map((item, index) => (
                <div className="inner-1em" key={index}>{item}</div>
              ))}
            </div>
            <button onClick={handleButtonClick}>Show Notification</button>
            <Map />
          </div>
        </div>
    </div>
  );
}

export default MainScreen;
