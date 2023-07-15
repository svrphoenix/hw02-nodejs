const express = require('express');

const {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
} = require('../controllers/authControllers');
const { bodyValidation, auth } = require('../middlewares');
const { userSchema, updateSubscriptionSchema } = require('../models/users');

const router = express.Router();

router.post('/register', bodyValidation(userSchema), register);

router.post('/login', bodyValidation(userSchema), login);

router.get('/current', auth, getCurrentUser);

router.post('/logout', auth, logout);

router.patch('/', auth, bodyValidation(updateSubscriptionSchema), updateSubscription);

module.exports = router;
