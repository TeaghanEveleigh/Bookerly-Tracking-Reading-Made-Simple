import 'dotenv/config';

import express, {
  type ErrorRequestHandler,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import cors, { type CorsOptions } from 'cors';

import userRoutes from './routes/user.routes.js';
import bookRoutes from './routes/book.routes.js';
import libraryRoutes from './routes/library.routes.js';
import pool from './config/db.js';
import { connectRedis } from './config/redis.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

const app = express();

const PORT = process.env.PORT ?? 3001;

const allowedOrigins = [
  'http://localhost:3000',
  'https://teaghaneveleigh.github.io',
  'https://main--elegant-griffin-6e8516.netlify.app',
] as const;

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin as (typeof allowedOrigins)[number])) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

pool.connect((err) => {
  if (err) {
    console.error('Failed to connect to database:', err);
    return;
  }

  console.log('Connected to database');
});
await connectRedis()


// User routes manage their own auth per-route.
// Login/signup are public.
app.use('/user', userRoutes);
app.use('/book', isAuthenticated, bookRoutes);
app.use('/library', isAuthenticated, libraryRoutes);

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
  });
});

const globalErrorHandler: ErrorRequestHandler = (
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err);

  res.status(err.status ?? 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
};

app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});