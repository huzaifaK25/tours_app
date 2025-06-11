import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handelersFactory.js';
// import AppError from '../utils/appError.js';

// Route Handelers
export const aliasTopTour = function (req, res, next) {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,difficulty,summary';
  next();
};

// export const getAllTours = catchAsync(async function (req, res, next) {
//   // EXECUTE QUERY
//   const features = new APIfeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();

//   const tours = await features.query;

//   // Send Response
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// });
export const getAllTours = factory.getAll(Tour);
// export const getTour = catchAsync(async function (req, res, next) {
//   // GET FROM DB BY ID
//   const tour = await Tour.findById(req.params.id).populate('reviews');

//   if (!tour) {
//     return next(new AppError('No tour found with this ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });
export const getTour = factory.getOne(Tour, { path: 'reviews' });
// export const createTour = catchAsync(async function (req, res, next) {
//   // POST TO DB
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });
export const createTour = factory.createOne(Tour);
// export const updateTour = catchAsync(async function (req, res, next) {
//   // PATCH TO DB
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidatiors: true,
//   });
//   if (!tour) {
//     return next(new AppError('No tour found with this ID', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });
export const updateTour = factory.updateOne(Tour);
// export const deleteTour = catchAsync(async function (req, res, next) {
//   // DELETE FROM DB
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('No tour found with this ID', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
export const deleteTour = factory.deleteOne(Tour);

export const getTourStats = catchAsync(async function (req, res, next) {
  // MONGO AGGREGATION PIPELINE
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: stats,
  });
});

export const getMonthlyPlan = catchAsync(async function (req, res, next) {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTours: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: plan,
  });
});
