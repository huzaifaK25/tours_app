import mongoose from 'mongoose';
import fs from 'fs';
import Tour from '../../models/tourModel.js';
import * as dotenv from 'dotenv';
dotenv.config({ path: './.env' });

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

// Read file
const tours = JSON.parse(
  fs.readFileSync('./dev-data/data/tours.json', 'utf-8'),
);

// import data to DB
const importData = async function () {
  try {
    await Tour.create(tours);
    console.log('Data loaded sucessfully!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// delete data from DB
const deleteData = async function () {
  try {
    await Tour.deleteMany();
    console.log('Data deleted sucessfully!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
