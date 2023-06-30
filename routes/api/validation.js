const Joi = require('joi');
const myCustomJoi = Joi.extend(require('joi-phone-number'));

const validationSchema = Joi.object({
  name: Joi.string().alphanum().min(2).max(30).required(),
  email: Joi.string().email().required(),
  phone: myCustomJoi.string().phoneNumber().required(),
});

module.exports =  validationSchema ;
