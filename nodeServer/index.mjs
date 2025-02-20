import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ksg from 'body-parser';
const { json } = ksg;
import { db, locations, onSnapshot, addDoc, deleteDoc, doc, setDoc } from './Firebase/Config.mjs';

dotenv.config();

const app = express();

const port = process.env.PORT | 3000;

app.use(cors());

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

let latestLocations = [];

const unsubscribe = onSnapshot(locations, (snapshot) => {
    const locations = [];
    snapshot.forEach((doc) => {
        locations.push({data: doc.data(), id: doc.id});
    });
    latestLocations = locations;
    console.log("Latest locations: ", latestLocations);
}, (error) => {
    console.error(error);
});

app.get('/api/locations', async (req, res) => {
    if(latestLocations) {
        res.json(latestLocations);
    }else {
        res.status(404).send('No locations found');
    }
});

app.post('/api/locations', async (req, res) => {
    const location = req.body;
    if(location) {
        const docRef = doc(db, 'locations', location.id);
        await setDoc(docRef, location.data);
        res.status(201).send(`Location added with ID: ${docRef.id}`);
    } else {
        res.status(400).send('Location not found in request body');
    }
});

app.delete('/api/locations/:id', async (req, res) => {
    console.log("Request params: ", req.params);
    const id = req.params.id;
    if(id) {
        const docRef = doc(db, 'locations', id);
        await deleteDoc(docRef);
        res.status(200).send(`Location with ID: ${id} deleted`);
    } else {
        res.status(400).send('Location ID not found in request');
    }
});

app.post('/api', (req, res) => {
    console.log("Request body: ", req.body);
    const receivedString = req.body.string; // Assuming the string is sent in the "string" field
    if (receivedString) {
        console.log("Received string: ", receivedString);
        res.send(`responseString: ${receivedString.toUpperCase()}`);
    } else {
        res.status(400).send('String not found in request body');
    }
});