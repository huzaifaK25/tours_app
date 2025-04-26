import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import factory from './handelersFactory.js';

const filterObj = function (obj, ...allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
};

// ROUTE HANDELERS
export const updateMyData = catchAsync(async function (req, res, next) {
  // Gen Error if user POSTs password
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password changes', 400));
  }
  // filtering out unwanted field names
  const filteredBody = filterObj(req.body, 'name', 'email');

  // Update user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMyAcc = catchAsync(async function (req, res) {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const createUser = function (req, res) {
  res.status(500).json({
    status: 'errr',
    message: 'Route Undefined, pls use /signup',
  });
};

export const getAllUsers = factory.getAll(User);
export const getUser = factory.getOne(User);
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
