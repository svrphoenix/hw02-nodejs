const Joi = require('joi');

const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});

// const emailSchema = Joi.object({
//   email: Joi.string().email().required(),
// });

const emailSchema = Joi.object().keys({
  email: userSchema.extract('email').required().messages({
    'any.required': `missing required field "email"`,
  }),
});

module.exports = {
  userSchema,
  updateSubscriptionSchema,
  emailSchema,
};
