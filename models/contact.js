const { Schema, model } = require('mongoose');
const { mongooseErrorHandler } = require('../helpers');

const Joi = require('joi');
const myCustomJoi = Joi.extend(require('joi-phone-number'));

const addContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(30),
  email: Joi.string().email().required(),
  phone: myCustomJoi.string().phoneNumber().required(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

contactSchema.post('save', mongooseErrorHandler);
const Contact = model('Contact', contactSchema);

module.exports = { addContactSchema, updateFavoriteSchema, Contact };
