import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { ENV } from './config/env.js';
import { initSocketService } from './services/socketService.js';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();
const server = http.createServer(app);

// Security & Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: ENV.NODE_ENV === 'production' ? undefined : false,
}));

// SECURITY: CORS restricted to configured origin only
const allowedOrigins = ENV.CORS_ORIGIN.split(',').map(o => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, server-to-server) in dev only
      if (!origin) {
        return callback(null, ENV.NODE_ENV !== 'production');
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// SECURITY: Global rate limiter — 100 requests per 15 minutes per IP
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
}));

// SECURITY: Strict rate limiter for auth endpoints — 10 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (ENV.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// API Routes
app.use('/api', apiRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'NagarChitra Civic-Tech Production API Server',
    status: 'running',
    docs: '/api/health',
    version: '1.0.0',
  });
});

// Real-time WebSockets
initSocketService(server);

// 404 and Global Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
server.listen(ENV.PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`  NagarChitra BD - Production Backend Server`);
  console.log(`  URL: http://localhost:${ENV.PORT}`);
  console.log(`  Health Check: http://localhost:${ENV.PORT}/api/health`);
  console.log(`  WebSockets: Enabled with Socket.io`);
  console.log(`  Environment: ${ENV.NODE_ENV}`);
  console.log(`====================================================`);
});

export default app;
