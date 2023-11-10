const bcrypt = require('bcrypt');
const createTokens = require('../helpers/createTokens');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');

const { User } = require('../models/users');

const { HttpError, ctrlWrapper, sendEmail, imageProcessor } = require('../helpers');

const { BASE_URL } = process.env;
const { PUBLIC, AVATARS_DIR, VERIFY_PATH, USERS_ROUTE } = require('../constants/path');

const avatarsPath = path.join(process.cwd(), PUBLIC, AVATARS_DIR);

const createVerifyEmail = (email, verificationToken) => ({
  to: email,
  subject: 'Contacts application - user email verification token',
  html: `<p>Please verify your email</p><a target="_blank" href="${BASE_URL}${USERS_ROUTE}${VERIFY_PATH}/${verificationToken}"><strong>Click to verify</strong></a>`,
});

const register = async (req, res) => {
  const { email, password } = req.body;
  const verificationToken = crypto.randomUUID();
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  await sendEmail(createVerifyEmail(email, verificationToken));

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }, 'email  password verify subscription avatarURL');
  if (!user) {
    throw new HttpError(401, 'Email or password is wrong');
  }

  if (!user.verify) {
    throw new HttpError(401, 'Email is not verified');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpError(401, 'Email or password is wrong');
  }

  const { accessToken, refreshToken } = createTokens(user);
  await User.findByIdAndUpdate(user._id, { token: refreshToken });

  res.json({
    token: accessToken,
    user: { email: user.email, subscription: user.subscription, avatarURL: user.avatarURL },
  });
};

const getCurrentUser = async (req, res) => {
  const { email, subscription, avatarURL } = req.user;

  res.json({
    email,
    subscription,
    avatarURL,
  });
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { token: null });

  res.status(204).send();
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;

  const updatedUser = await User.findByIdAndUpdate(_id, req.body, { new: true });

  res.status(200).json({
    email: updatedUser.email,
    subscription: updatedUser.subscription,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUploadPath, originalname } = req.file;

  const avatarName = `${_id}-${originalname}`;
  const destinationUploadPath = path.join(avatarsPath, avatarName);
  const avatarURL = path.join(AVATARS_DIR, avatarName);

  await imageProcessor(tempUploadPath);
  await fs.rename(tempUploadPath, destinationUploadPath);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).json({
    avatarURL,
  });
};

const emailVerification = async (req, res) => {
  const { verificationToken } = req.params;

  const user = await User.findOne({ verificationToken });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  await User.findByIdAndUpdate(user._id, { verificationToken: null, verify: true });

  res.json({ message: 'Verification successful' });
};

const resendEmailVerification = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  if (user.verify) {
    throw new HttpError(400, 'Verification has already been passed');
  }

  const verificationToken = crypto.randomUUID();

  await sendEmail(createVerifyEmail(email, verificationToken));
  await User.findByIdAndUpdate(user._id, { verificationToken });

  res.json({ message: 'Verification email sent' });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  emailVerification: ctrlWrapper(emailVerification),
  resendEmailVerification: ctrlWrapper(resendEmailVerification),
};
