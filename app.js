import express from 'express';
import morgan from 'morgan';
import AppError from './utils/appError.js';
import globalErr from './controllers/errorController.js';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
// IMPORTING THE ROUTERS
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';

// Creating Express App
const app = express();

// Global Middleware Functions

// Security HTTP middleware
app.use(helmet());
// Development logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Rate Limter Middleware(for DOS and Brute attack)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 reqs per hour
  message: 'Request limit reached',
});
app.use('/api', limiter);
// Body parser middleware, read data from body to req.body
app.use(express.json({ limit: '10kb' }));
// Data Sanitization(NoSql Query Injection Attack)(removes symbolns from query)
app.use(mongoSanitize());
// Data Sanitization(XSS attack)(removes malicion html)
app.use(xss());
// Prevent HTTP parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);
// serving static files
app.use(express.static('./public'));

// MOUNTING THE ROUTER
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);
// Route for undefined routes (ERROR HANDELING)
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot fine URL:${req.baseUrl}`, 404));
});
// GLOBAL ERROR HANDELING MIDDLEWARE
app.use(globalErr);

export default app;
