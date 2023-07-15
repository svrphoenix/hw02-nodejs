const express = require('express');

const {
  register,
  login,
  logout,
  current,
  subscriptionUpdate,
} = require('../controllers/authControllers');
const { bodyValidation, auth } = require('../middlewares');
const { userSchema, updateSubscriptionSchema } = require('../models/users');

const router = express.Router();

router.post('/register', bodyValidation(userSchema), register);

router.post('/login', bodyValidation(userSchema), login);

router.get('/current', auth, current);

router.post('/logout', auth, logout);

router.patch('/', auth, bodyValidation(updateSubscriptionSchema), subscriptionUpdate);

module.exports = router;
