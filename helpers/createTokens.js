const jwt = require('jsonwebtoken');

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY, ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN } =
  process.env;

const createTokens = user => {
  const payload = {
    id: user._id,
  };
  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: ACCESS_EXPIRES_IN,
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: REFRESH_EXPIRES_IN,
  });

  return { accessToken, refreshToken };
};

module.exports = { createTokens };
