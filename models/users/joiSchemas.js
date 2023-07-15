const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});

module.exports = {
  userSchema,
  updateSubscriptionSchema,
};
