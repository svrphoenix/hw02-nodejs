const { HttpError } = require('../helpers');

const bodyValidation = schema => {
  return (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(new HttpError(400, `Validation error: ${error.message}!`));
    }
    next();
  };
};

module.exports = bodyValidation;
