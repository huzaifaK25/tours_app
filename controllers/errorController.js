import AppError from '../utils/appError.js';

const handleCastErrorDB = function (error) {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = function (error) {
  const value = error.keyValue.name;
  // console.log(value);
  const message = `Duplicate field value: ${value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = function (error) {
  const errors = Object.values(error.errors).map((el) => el.message);
  const message = `Invalid input data ${errors.join('. ')}`;

  return new AppError(message, 400);
};

const handleJWTError = function () {
  return new AppError('Invalid token please login again', 401);
};

const handleJWTExpiredError = function () {
  return new AppError('Token expired, please login again', 401);
};

const sendErrorDev = function (error, res) {
  res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = function (error, res) {
  // if Operational error it is trusted and set by us
  if (error.isOperational === true) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
    //if not operational error is not by trusted source/ by user
  } else {
    console.error('ERROR', error);

    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

export default (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === 'production') {
    let err = { ...error };
    // console.log(error);

    // To handle invalid input values
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    // To handle duplicate inputs
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    // To handle Mongo validation errors
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    // To handle Invalid Token error
    if (err.name === 'JsonWebTokenError') err = handleJWTError();
    // To handle Expired token error
    if (err.name === 'TokenExpiredError') err = handleJWTExpiredError();

    sendErrorProd(err, res);
  }
};
