const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const session = require("express-session");
const userRoutes = require('./src/routes/userRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const libraryRoutes = require('./src/routes/libraryRoutes');
const discoverRoutes = require('./src/routes/discoverRoutes');
const pool = require("./src/config/db.js");
const  createTables  = require("./src/config/createTables.js");
const { options } = require("nodemon/lib/config/index.js");
const cors = require('cors');
//10 seconds in milliseconds
const maxAge = 10 * 1000;

// Setup express app
const app = express();
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
  
app.use(bodyParser.json());
pool.connect((err) => {
    if (err) {
        console.error('Failed to connect to database:', err);
    } else {
        console.log('Connected to database');
    }
});

// Configure express-session middleware


app.use('/user', userRoutes);
app.use('/book', bookRoutes);
app.use('/library', libraryRoutes);
app.use('/discover', discoverRoutes);

app.get('/',  (req, res) => {
    res.send('Hello World!');
});
app.use((req, res) => {
    res.status(404).send('404 - Not Found');
});

const PORT = process.env.PORT || 3001; // Use the provided port by Heroku or default to 3001

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
