import express from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch(
  '/update-my-password',
  authController.protect,
  authController.updatePassword,
);
router.patch(
  '/update-my-data',
  authController.protect,
  userController.updateMyData,
);
router.delete(
  '/delete-my-account',
  authController.protect,
  userController.deleteMyAcc,
);

// BELOW ROUTES IN RESTful FORMAT
//prettier-ignore
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
//prettier-ignore
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
