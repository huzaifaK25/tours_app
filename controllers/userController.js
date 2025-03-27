import User from '../models/userModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// ROUTE HANDELERS
export const getAllUsers = catchAsync(async function (req, res, next) {
  const users = await User.find();

  // Send Response
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export const createUser = function (req, res) {
  res.status(500).json({
    status: 'errr',
    message: 'Route Undefined',
  });
};

export const getUser = function (req, res) {
  res.status(500).json({
    status: 'errr',
    message: 'Route Undefined',
  });
};

export const updateUser = function (req, res) {
  res.status(500).json({
    status: 'errr',
    message: 'Route Undefined',
  });
};

export const deleteUser = function (req, res) {
  res.status(500).json({
    status: 'errr',
    message: 'Route Undefined',
  });
};
