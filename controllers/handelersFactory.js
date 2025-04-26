import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const deleteOne = function (Model) {
  catchAsync(async function (req, res, next) {
    // DELETE FROM DB
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with this ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
};

export const updateOne = (Model) =>
  catchAsync(async function (req, res, next) {
    // PATCH TO DB
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidatiors: true,
    });
    if (!doc) {
      return next(new AppError('No document found with this ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });
