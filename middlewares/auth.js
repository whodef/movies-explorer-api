const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError.js');
const { errorMessages } = require('../utils/constants.js');
const config = require('../config/config.js');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError(errorMessages.authorizationErrorMessageJWT));
  }

  try {
    req.user = jwt.verify(authorization.substring(7), config.jwt_secret);
  } catch (err) {
    return next(new AuthorizationError(errorMessages.authorizationErrorMessageJWT));
  }
  return next();
};
