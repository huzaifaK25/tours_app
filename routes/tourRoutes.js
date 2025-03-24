import express from 'express';
import * as tourController from '../controllers/tourController.js';

const router = express.Router();

router
  .route('/top-5-cheapest')
  .get(tourController.aliasTopTour, tourController.getAllTours);

//prettier-ignore
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
//prettier-ignore
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export default router;
