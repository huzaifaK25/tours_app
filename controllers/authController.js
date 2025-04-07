import { promisify } from 'util';
import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import crypto from 'crypto';
import sendEmail from '../utils/email.js';

const expDate = new Date(
  Date.now() + 30 * 24 * 60 * 60 * 1000, //30days in ms
);
const cookieOps = {
  expires: expDate,
  httpOnly: true,
};
if (process.env.NODE_ENV === 'production') cookieOps.secure = true;

const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

const createSendToken = function (user, statusCode, res) {
  const token = signToken(user._id);

  res.cookie('jwt', token, cookieOps);
  // remove password from cookie output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user,
    },
  });
};

export const signUp = catchAsync(async function (req, res, next) {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  createSendToken(newUser, 201, res);
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
  createSendToken(user, 200, res);
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

// restricts actions to user w specific roles
export const restrictTo = function (...roles) {
  // roles is an array of all inputs
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission for this action', 403),
      );
    }
    next();
  };
};

export const forgotPassword = catchAsync(async function (req, res, next) {
  // Get user based on Token
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with that email', 404));
  }
  // Generate reset Token
  const resetToken = user.createPasswordResetToken();
  // save password changes to DB and deactivates validators for PW change
  await user.save({ validateBeforeSave: false });

  // Send Token to users Email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;
  const message = `Forgot password? Submit PATCH with new password and password confirm to ${resetURL}\n
  If you did not forget your password then ignore this email`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password rest token. (Valid for 10 min)',
      message,
    });

    res.status(200).json({
      statu: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error resetting password, Try again.', 500),
    );
  }
});

export const resetPassword = catchAsync(async function (req, res, next) {
  // Get user based on Token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // FInd User for the token AND check if token has Expired or not
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  // Set password if token !expired
  if (!user) {
    return next(new AppError('Token has expired', 400));
  }
  // Update changed password and changedPasswordAt(done in userModel)
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // log user in with new password
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async function (req, res, next) {
  // Get already logged in user from DB
  const user = await User.findById(req.params.id).select('+password');

  // Check if Current Pw is correct?
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is incorrect', 401));
  }

  // Update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Log user in with new password
  createSendToken(user, 200, res);
});
