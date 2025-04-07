import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';
import User from './userModel.js';

// CREATING SCHEMA
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'Tour must have a name'],
      maxlength: [40, 'Name must have at most 40 characters'],
      minlength: [10, 'Name must have at least 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must contain letters only'],
    },
    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Choose difficulty level from easy/medium/difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1.0'],
      max: [5, 'Rating must be at most 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this works only on new doc creation
          return val < this.price;
        },
        message: 'Discount price invalid',
      },
    },
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
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], //Coordinates(long/lat)
      address: String,
      description: String,
    },
    locations: [
      //Array notation used to define EMBEDDED Docs
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    // options object, above is schema object
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// VIRTUAL PROPERTY: not a part of DB just to calc and display
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
// VIRTUAL POPULATE
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before/after .save() and .create() only
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
tourSchema.pre('save', async function (next) {
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  // add new $match in start of pipeline in tourStats
  this.pipeline().unshift({ match: { secretTour: { $ne: true } } });
  next();
});

// CREATING MODEL FROM SCHEMA
const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
