import express from 'express';
import morgan from 'morgan';
import AppError from './utils/appError.js';
import globalErr from './controllers/errorController.js';
// IMPORTING THE ROUTERS
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

// Creating Express App
const app = express();

// Adding Middleware Functions
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static('./public'));

// MOUNTING THE ROUTER
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
// Route for undefined routes (ERROR HANDELING)
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot fine URL:${req.baseUrl}`, 404));
});
// GLOBAL ERROR HANDELING MIDDLEWARE
app.use(globalErr);

export default app;
