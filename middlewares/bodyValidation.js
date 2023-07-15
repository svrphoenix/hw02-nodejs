const { HttpError } = require('../helpers');

const bodyValidation = schema => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(new HttpError(400, `Validation error: ${error.message}!`));
    }
    next();
  };

  return func;
};

module.exports = bodyValidation;
