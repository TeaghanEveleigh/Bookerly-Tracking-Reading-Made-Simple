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
const allowedOrigins = ['http://localhost:3000', 'https://teaghaneveleigh.github.io'];
// Setup express app
const app = express();
app.use(cors({
    origin: function(origin, callback){
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Added OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // Important for sending cookies
    preflightContinue: true, // Enable preflight OPTIONS requests
}));

app.use(session({
    secret: 'secret-code',
    resave: false,
    saveUninitialized: true
}));
app.use(bodyParser.json());
pool.connect((err) => {
    if (err) {
        console.error('Failed to connect to database:', err);
    } else {
        console.log('Connected to database');
    }
});
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
}
// Configure express-session middleware


app.use('/user', userRoutes);
app.use('/book', isAuthenticated, bookRoutes); // Apply isAuthenticated middleware here
app.use('/library', isAuthenticated, libraryRoutes); // Apply isAuthenticated middleware here
app.use('/discover', isAuthenticated, discoverRoutes);

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
