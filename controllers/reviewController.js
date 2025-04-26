import Review from '../models/reviewModel.js';
import factory from './handelersFactory.js';
// import catchAsync from '../utils/catchAsync.js';

// export const getAllReviews = catchAsync(async function (req, res, next) {
//   let filter = {};
//   if (req.params.tourID) filter = { tour: req.params.tourID };
//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });
export const getAllReviews = factory.getAll(Review);

export const setTourUserID = function (req, res, next) {
  // To allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourID;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

export const getReview = factory.getOne(Review);
export const createReview = factory.createOne(Review);
export const updateReview = factory.updateOne(Review);
export const deleteReview = factory.deleteOne(Review);
