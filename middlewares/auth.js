const jwt = require('jsonwebtoken');

const { User } = require('../models/users');
const { HttpError } = require('../helpers');
const { createTokens } = require('../helpers/createTokens');

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const auth = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, receivedToken] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || !receivedToken) {
    return next(new HttpError(401, 'Not authorized'));
  }

  const { id } = jwt.decode(receivedToken);
  let user;

  try {
    user = await User.findById(id);

    if (!user || !user.token) {
      return next(new HttpError(401, 'Not authorized'));
    }

    jwt.verify(receivedToken, ACCESS_SECRET_KEY);
    req.user = user;
    next();
  } catch (err) {
    if (err.name !== 'TokenExpiredError') {
      return next(new HttpError(401, 'Not authorized'));
    }
    try {
      jwt.verify(user.token, REFRESH_SECRET_KEY);
      const { accessToken, refreshToken } = createTokens(user);
      await User.findByIdAndUpdate(
        user._id,
        {
          token: refreshToken,
        },
        { new: true }
      );
      res.status(200).json({ token: accessToken });
    } catch (error) {
      return next(new HttpError(401, 'Not authorized'));
    }
  }
};

module.exports = auth;
