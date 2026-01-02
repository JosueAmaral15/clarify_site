import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { apiLimiter } from './middleware/rateLimiter';
import {
  sanitizeMongoQueries,
  preventParameterPollution,
  sanitizeInput,
  securityHeaders,
} from './middleware/sanitization';
import {
  errorHandler,
  notFoundHandler,
} from './middleware/errorHandler';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Security Middleware (OWASP Top 10 Protection)
// 1. Security Headers
app.use(helmet());
app.use(securityHeaders);

// 2. CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// 3. Rate Limiting (DDoS protection)
app.use(apiLimiter);

// 4. Body Parser (with size limits to prevent payload attacks)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Data Sanitization against NoSQL injection
app.use(sanitizeMongoQueries);

// 6. Data Sanitization against XSS
app.use(sanitizeInput);

// 7. Prevent HTTP Parameter Pollution
app.use(preventParameterPollution);

// Health Check Route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Clarify Site API is running',
    timestamp: new Date().toISOString(),
  });
});

// Root Route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'Clarify Site API',
    version: '1.0.0',
    description: 'Backend API for Clarify Site',
    endpoints: {
      health: '/health',
      api: '/api',
    },
  });
});

// 404 Handler (must be after all routes)
app.use(notFoundHandler);

// Global Error Handler (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
