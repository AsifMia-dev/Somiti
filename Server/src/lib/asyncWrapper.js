function asyncWrapper(fn) {
  return function asyncHandler(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncWrapper;
