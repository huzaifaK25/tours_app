import mongoose from 'mongoose';

// CREATING SCHEMA
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    trim: true,
    required: [true, 'Tour must have a name'],
  },
  duration: {
    type: Number,
    required: [true, 'Tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'Tour must have a difficulty level'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  retingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'Tour must have a summary description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  startDates: [Date],
});
// CREATING MODEL FROM SCHEMA
const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
