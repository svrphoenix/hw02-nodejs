const express = require('express');

const {
  register,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  emailVerification,
  resendEmailVerification,
} = require('../controllers/authControllers');

const { bodyValidation, auth, upload } = require('../middlewares');

const { userSchema, updateSubscriptionSchema, emailSchema } = require('../models/users');

const router = express.Router();

router.post('/register', bodyValidation(userSchema), register);

router.post('/login', bodyValidation(userSchema), login);

router.get('/current', auth, getCurrentUser);

router.post('/logout', auth, logout);

router.patch('/', auth, bodyValidation(updateSubscriptionSchema), updateSubscription);

router.patch('/avatars', auth, upload.single('avatar'), updateAvatar);

router.get('/verify/:verificationToken', emailVerification);

router.post('/verify', bodyValidation(emailSchema), resendEmailVerification);

module.exports = router;
