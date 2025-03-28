class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; //to check if error is an operational error

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
