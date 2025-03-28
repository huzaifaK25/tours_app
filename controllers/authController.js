import { promisify } from 'util';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import { log } from 'console';

const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

export const signUp = catchAsync(async function (req, res, next) {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);
  res.status(200).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

export const logIn = catchAsync(async function (req, res, next) {
  const { email, password } = req.body;
  // check if email and password exist/entered or not
  if (!email || !password) {
    return next(new AppError('Please enter email and password'), 400);
  }
  // check if correct email and password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }
  // if all okay send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

export const protect = catchAsync(async function (req, res, next) {
  // Get User's Token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // 'Bearer eteyeuiwwdn'
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    next(new AppError('You are not logged in', 401));
  }
  // Verify Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // Check if User Exists w this Token
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    next(new AppError('User does not exist', 401));
  }
  //Check if User changed PW after Token was generated
  if (currentUser.changedPassword(decoded.iat)) {
    return new AppError('Password was changed, Pls login again', 401);
  }
  req.user = currentUser;
  // Grant access to protected route
  next();
});
