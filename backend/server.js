const db = require('./config/db');
const express = require('express');
const PORT = 5001;

const app = express();
app.use(express());
app.use(express.json());



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
