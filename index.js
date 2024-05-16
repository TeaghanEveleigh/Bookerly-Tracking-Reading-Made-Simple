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
const frontendDomain = 'localhost'; 
const frontendPort = 3000;
const cors = require('cors');
//10 seconds in milliseconds
const maxAge = 10 * 1000;
const allowedOrigins = ['http://localhost:3000', 'https://teaghaneveleigh.github.io'];
// Setup express app
const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'https://teaghaneveleigh.github.io'], // Your frontend origin(s)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,  // If you're using cookies for authentication
}));


app.use(session({
    secret: 'secret-code',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,   // Prevent client-side access
        secure: process.env.NODE_ENV === 'production', // Secure in production
        //sameSite: 'strict',  // Comment this out for now for testing purposes.
        maxAge: 1000 * 60 * 60 * 24, // 1 day (adjust as needed)
    //  Set domain explicitly to match your frontend
    },
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
app.use('/book', bookRoutes); // Apply isAuthenticated middleware here
app.use('/library', libraryRoutes); // Apply isAuthenticated middleware here
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
