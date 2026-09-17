const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  if(err.status){
    return res.status(err.status).json({error:err.message})
  }
  return res.status(500).json({error: "Internal Server Error"})
};

module.exports = {
  notFound,
  errorHandler,
};
