const db = require('./config/db');
const express = require('express');
const PORT = 5001;

const app = express();
app.use(express());
app.use(express.json());

const UserRoutes = require('./api/user')
const PostRoutes = require('./api/post')

app.use('/api/user', UserRoutes)
app.use('/api/post', PostRoutes)
app.use('/uploads', express.static(__dirname + '../../uploads'))

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
