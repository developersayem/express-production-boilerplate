import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as Sentry from '@sentry/node';
import { config } from './config';
import { errorMiddleware } from './middlewares/error.middleware';
import { ApiError } from './utils/ApiError';
import { setupSwagger } from './docs/openapi';
import { metricsRegistry, httpRequestDurationMicroseconds } from './utils/monitoring';

// Routes
import healthRouter from './modules/health/health.route';

const app = express();

// Init Sentry
Sentry.init({
  dsn: config.sentry.dsn,
  tracesSampleRate: 1.0,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logging
app.use(morgan('combined'));

// Prometheus metrics middleware
app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.route ? req.route.path : req.path, code: res.statusCode });
  });
  next();
});

// Expose metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', metricsRegistry.contentType);
  res.end(await metricsRegistry.metrics());
});

// Setup Swagger UI
setupSwagger(app);

// API Routes
app.use('/api/health', healthRouter);

// Unknown route handler
app.use((req, res, next) => {
  next(new ApiError(404, 'Not Found'));
});

// Sentry Error Handler setup for v8
Sentry.setupExpressErrorHandler(app);

// Custom Global Error Handler
app.use(errorMiddleware);

export default app;
