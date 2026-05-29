require('dotenv').config();
import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes.js';
import bookRoutes from './routes/book.routes.js';
import libraryRoutes from './routes/library.routes.js';
import createTables from './config/createTables.js';
import pool from './config/db.js';
import { isAuthenticated  } from './middleware/authMiddleware.js';

const app = express();

const allowedOrigins = [
    'http://localhost:3000',
    'https://teaghaneveleigh.github.io',
    'https://main--elegant-griffin-6e8516.netlify.app',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.options('*', cors());
app.use(express.json());
pool.connect((err) => {
    if (err) {
        console.error('Failed to connect to database:', err);
    } else {
        console.log('Connected to database');
    }
});

// user routes manage their own auth per-route (login/signup are public)
app.use('/user',     userRoutes);
app.use('/book',     isAuthenticated, bookRoutes);
app.use('/library',  isAuthenticated, libraryRoutes);

app.get('/', (req, res) => res.send('Hello World!'));

// 404
app.use((req, res) => res.status(404).json({ success: false, error: 'Not found' }));

// Global error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ success: false, error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
