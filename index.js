const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require('cookie-parser');
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
app.use(cookieParser());
app.use((req, res, next) => {
    const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins.includes(origin) ? origin : '');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});
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
    console.log("=== isAuthenticated Middleware ===");
    console.log("Request request:", req); // Log the request method
    console.log("Request Headers:", req.headers); // Log all headers to see if the cookie is there
    console.log("Cookies:", req.cookies);       // Log the parsed cookies object
  
    const sessionCookie = req.cookies.session;  // Assuming your session cookie is named 'session'
  
    console.log("Session Cookie:", sessionCookie); // Log the session cookie value
  
    if (sessionCookie) {
      console.log("Session ID from Cookie:", sessionCookie);
      console.log("Session ID from Server:", req.sessionID);
  
      if (req.sessionID === sessionCookie) {
        console.log("Authentication Successful");
        return next(); // Proceed to the next middleware/route handler
      } else {
        console.log("Session IDs Don't Match!");
      }
    } else {
      console.log("No Session Cookie Found");
    }
  
    console.log("Authentication Failed");
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
