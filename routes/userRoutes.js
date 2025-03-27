import express from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.logIn);

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
