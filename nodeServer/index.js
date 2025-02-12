const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

const port = process.env.PORT | 3000;

app.use(cors());

app.use(express.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
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