const Joi = require('joi');
const myCustomJoi = Joi.extend(require('joi-phone-number'));

const addContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  email: Joi.string().email().required(),
  phone: myCustomJoi.string().phoneNumber().required(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object().keys({
  favorite: addContactSchema.extract('favorite').required(),
});

module.exports = { addContactSchema, updateFavoriteSchema };
