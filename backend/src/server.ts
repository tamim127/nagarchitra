import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { ENV } from './config/env.js';
import { initSocketService } from './services/socketService.js';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();
const server = http.createServer(app);

// Security & Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin) return callback(null, true);
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (ENV.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
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
