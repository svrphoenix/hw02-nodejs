const jwt = require('jsonwebtoken');

const { User } = require('../models/users');
const { HttpError } = require('../helpers');

const { SECRET_KEY } = process.env;

const auth = async (req, _, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || !token) {
    return next(new HttpError(401, 'Not authorized'));
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token || user.token !== token) {
      next(new HttpError(401, 'Not authorized'));
    }
    // jwt.verify(token, SECRET_KEY);
    // const user = await User.findOne({ token: token });

    // if (!user) {
    //   next(new HttpError(401, 'Not authorized'));
    // }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return next(new HttpError(401, 'Not authorized'));
    }
    next(err);
  }
};

module.exports = auth;
