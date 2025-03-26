import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

// Handeling all Uncaught Exception Errors
// Defined before app so exceptions are caught everywhere
process.on('uncaughtException', (error) => {
  console.log('Uncaught Exception, Shutting Down...');
  console.log(error.name, error.message);
  process.exit(1);
});

dotenv.config({ path: './.env' });
import app from './app.js';

// CONNECTING DATABASE
const DB = process.env.DB.replace('<password>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Connected');
  });

// STARTING SERVER ON PORT
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handeling all Uncaight Promise Rejections
process.on('unhandledRejection', (error) => {
  console.log('Unhaldeled Rejection, Shutting Down...');
  console.log(error.name, error.message);
  server.close(() => {
    process.exit(1);
  });
});
