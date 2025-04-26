import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import APIfeatures from '../utils/apiFeatures.js';

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

export const createOne = (Model) =>
  catchAsync(async function (req, res, next) {
    // POST TO DB
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Model, popOptions) =>
  catchAsync(async function (req, res, next) {
    // GET FROM DB BY ID
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

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

export const getAll = (Model) =>
  catchAsync(async function (req, res, next) {
    // to allpw nested GET revies on tour
    let filter = {};
    if (req.params.tourID) filter = { tour: req.params.tourID };

    // EXECUTE QUERY
    const features = new APIfeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    // Send Response
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
