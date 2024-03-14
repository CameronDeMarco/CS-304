require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');

console.log("MongoDB URI:", process.env.MONGODB_URI);

mongoose.connect(
    process.env.MONGODB_URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        dbName: 'ActivityApp'
    }).then(() => {
        console.log("DB Connected");
    }).catch((err) => console.log(err));