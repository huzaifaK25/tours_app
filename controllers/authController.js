import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';

export const signUp = catchAsync(async function (req, res, next) {
  const newUser = await User.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});
