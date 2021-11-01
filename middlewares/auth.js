const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError.js');
const { errorMessages } = require('../utils/constants.js');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthorizationError(errorMessages.authorizationErrorMessageJWT);
  }

  const { JWT_SECRET } = process.env;

  try {
    req.user = jwt.verify(authorization.substring(7), JWT_SECRET);
    next();
  } catch (err) {
    throw new AuthorizationError(errorMessages.authorizationErrorMessageJWT);
  }
};
