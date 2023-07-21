const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
// const Jimp = require('jimp');
const imageProcessor = require('../helpers/imageProcessor');

const { User } = require('../models/users');

const { HttpError, ctrlWrapper } = require('../helpers');

const { SECRET_KEY } = process.env;
const { PUBLIC, AVATARS_DIR } = require('../constants/path');

const avatarsPath = path.join(process.cwd(), PUBLIC, AVATARS_DIR);

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw new HttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);

  const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL });

  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }, 'email subscription password');
  if (!user) {
    throw new HttpError(401, 'Email or password invalid');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new HttpError(401, 'Email or password is wrong');
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    SECRET_KEY,
    { expiresIn: '12h' }
  );
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
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

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrentUser: ctrlWrapper(getCurrentUser),
  logout: ctrlWrapper(logout),
  updateSubscription: ctrlWrapper(updateSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
};
