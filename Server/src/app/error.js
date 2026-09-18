const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  if (statusCode === 404) {
    return res.status(404).json({ error: err.message });
  }

  console.log('server error');
  return res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = {   
  notFound,
  errorHandler,
};
