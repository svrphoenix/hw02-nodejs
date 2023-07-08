const { isValidObjectId } = require('mongoose');

const { HttpError } = require('../helpers');

const idValidation = (req, _, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    next(new HttpError(400, `${contactId} is not a valid id`));
  }
  next();
};

module.exports = idValidation;
