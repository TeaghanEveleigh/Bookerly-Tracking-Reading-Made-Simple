const express = require("express");
const session = require("express-session");
const cors = require("cors");
const userRoutes = require("./src/routes/userRoutes");
const bookRoutes = require("./src/routes/bookRoutes");
const libraryRoutes = require("./src/routes/libraryRoutes");
const discoverRoutes = require("./src/routes/discoverRoutes");
const pool = require("./src/config/db.js");

const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://teaghaneveleigh.github.io' , 'https://main--elegant-griffin-6e8516.netlify.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Handle preflight requests
app.options('*', cors());

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: 'none', // For cross-origin requests
    },
}));

app.use(express.json());

pool.connect((err) => {
    if (err) {
        console.error('Failed to connect to database:', err);
    } else {
        console.log('Connected to database');
    }
});

function isAuthenticated(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log("token on backend is" , token)
    if(token) { 
        jwt.verify(token , 'my key' , (err, decoded ) => { // Use jwt.verify
            if(err){
                return res.status(401).json({error: 'Unauthorized'});
            }else{
                req.user = decoded;
                next();
            }
        });
    } else{
        res.status(401).json({error:'No token provided'})
    }   
}

app.use('/user', userRoutes);
app.use('/book', isAuthenticated, bookRoutes);
app.use('/library', isAuthenticated, libraryRoutes);
app.use('/discover', isAuthenticated, discoverRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use((req, res) => {
    res.status(404).send('404 - Not Found');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
