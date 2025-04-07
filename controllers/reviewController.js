import Review from '../models/reviewModel.js';
import catchAsync from '../utils/catchAsync.js';

export const getAllReviews = catchAsync(async function (req, res, next) {
  let filter = {};
  if (req.params.tourID) filter = { tour: req.params.tourID };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

export const createReview = catchAsync(async function (req, res, next) {
  // To allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourID;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
