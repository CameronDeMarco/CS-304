const db = require('./config/db');
const express = require('express');
const PORT = 5001;

const app = express();
app.use(express());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const UserRoutes = require('./api/user')
const PostRoutes = require('./api/post')

app.use('/api/user', UserRoutes)
app.use('/api/post', PostRoutes)



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
