import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import app from './app.js';

// CONNECTING DATABASE
const DB = process.env.DB.replace('<password>', process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Database Connected');
  });

// STARTING SERVER ON PORT
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
