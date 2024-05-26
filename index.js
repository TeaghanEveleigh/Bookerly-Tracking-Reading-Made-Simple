require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const userRoutes = require('./src/routes/userRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const libraryRoutes = require('./src/routes/libraryRoutes');
const discoverRoutes = require('./src/routes/discoverRoutes');
const pool = require('./src/config/db.js');

const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://teaghaneveleigh.github.io'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(helmet());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: 'none'
    },
}));

app.use(bodyParser.json());

pool.connect(err => {
    if (err) {
        console.error('Failed to connect to database:', err);
    } else {
        console.log('Connected to database');
    }
});

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
}

app.use('/user', userRoutes);
app.use('/book', isAuthenticated, bookRoutes);
app.use('/library', isAuthenticated, libraryRoutes);
app.use('/discover', isAuthenticated, discoverRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
