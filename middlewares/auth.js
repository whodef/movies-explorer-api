const jwt = require("jsonwebtoken");
const AuthorizationError = require("../errors/AuthorizationError");
const { errorMessages } = require("../utils/constants");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthorizationError(errorMessages.authorizationErrorMessageJWT);
  }

  const { NODE_ENV, JWT_SECRET_PROD } = process.env;

  try {
    req.user = jwt.verify(authorization.substring(7), NODE_ENV === "production" ? JWT_SECRET_PROD : "dev-secret");
    next();
  } catch (err) {
    throw new AuthorizationError(errorMessages.authorizationErrorMessageJWT);
  }
};
