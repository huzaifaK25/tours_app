import express from 'express';
import * as tourController from '../controllers/tourController.js';
import * as authController from '../controllers/authController.js';
import reviewRoutes from '../routes/reviewRoutes.js';

const router = express.Router();

// router
//   .route('/:tourID/reviews')
//   .post(
//     authController.protect,
//     authController.restrictTo('user'),
//     reviewController.createReview,
//   );
router.use('/:tourId/reviews', reviewRoutes);

router
  .route('/top-5-cheapest')
  .get(tourController.aliasTopTour, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

//prettier-ignore
router
  .route('/')
  .get(authController.protect ,tourController.getAllTours)
  .post(tourController.createTour);
//prettier-ignore
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect, 
    authController.restrictTo('admin','lead-guide'), 
    tourController.deleteTour);

export default router;
