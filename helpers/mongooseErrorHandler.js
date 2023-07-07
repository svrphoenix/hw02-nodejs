const mongooseErrorHandler = (error, data, next) => {
  error.statusCode = 400;
  next();
};

module.exports = mongooseErrorHandler;
