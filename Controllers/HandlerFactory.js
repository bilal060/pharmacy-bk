const HttpError = require("../utils/httpError");

exports.deleteOne = (Model) => async (req, res, next) => {
  let doc;
  try {
    doc = await Model.findByIdAndDelete(req.params.id);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Data Error", 500));
  }

  if (!doc) {
    return next(new HttpError("No Data Find by this Id", 404));
  }
  res.status(200).json({
    status: "success",
    message: "Data Deleted Successfully",
    data: null,
  });
};
exports.updateOne = (Model) => async (req, res, next) => {
  let doc;
  try {
    doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });           
  } catch (error) {
    console.log(error);
    return next(new HttpError("Data Error", 500));
  }

  if (!doc) {
    return next(new HttpError("No Data Find by this Id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
};
exports.createOne = (Model) => async (req, res, next) => {
  let doc;
  try {
    doc = await Model.create(req.body);
  } catch (error) {
    console.log(error);
    return next(new HttpError("Data Error", 500));
  }
  if (!doc) {
    return next(new HttpError("No Data Find by this Id", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
};

exports.getAll = (Model,popOptions = null, filter = {}) => async (req, res, next) => {

  const page = parseInt(req.query.page) || 1
  const limit = 10
  const skip = (page - 1) * limit
  let query = Model.find(filter).skip(skip).limit(limit);
  if (popOptions){
    if (Array.isArray(popOptions)) {
      popOptions.forEach(option => {
        query = query.populate(option).skip(skip).limit(limit);
      });
    } else {
      query = query.populate(popOptions).skip(skip).limit(limit);
    }

  }
  let docs;
  try {
    docs = await query;
  } catch (error) {
    console.log(error);
    return next(new HttpError("Data Error", 500));
  }

  res.status(200).json({
    result: query.length,
    status: "success",
    results: docs.length,
    limit,
    page,
    data: {
      docs,
    },
  });
};
