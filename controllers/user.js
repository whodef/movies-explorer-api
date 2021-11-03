const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const NotFoundError = require('../errors/NotFoundError.js');
const DataConflictError = require('../errors/DataConflictError.js');
const BadRequestError = require('../errors/BadRequestError.js');
const { errorMessages } = require('../utils/constants.js');
const config = require('../config/config.js');
const AuthorizationError = require('../errors/AuthorizationError.js');

// Обработчик
const handleError = (err, next) => {
  if (err.name === 'CastError') {
    return next(new DataConflictError(errorMessages.validationErrorMessage));
  }
  return next(err);
};

module.exports.findAuthUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      return next(new NotFoundError(errorMessages.notFoundUserErrorMessage));
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  User.checkEmailDuplicate(email).then(() => {
    bcrypt.hash(password, 10) // соль
      .then((hash) => User.create({
        name, email, password: hash,
      })
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequestError(errorMessages.authorizationErrorMessageLogin));
          }
          if (err.name === 'MongoError' && err.code === 11000) {
            return next(new DataConflictError(errorMessages.emailConflictErrorMessage));
          }
          return next(err);
        }));
  })
    .catch((err) => handleError(err, next));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Может генерировать исключение
      const token = jwt.sign(
        { _id: user._id },
        config.jwt_secret,
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(() => next(new AuthorizationError(errorMessages.authorizationErrorMessageLogin)));
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.checkEmailDuplicate(email).then(() => {
    User.findByIdAndUpdate(req.user._id, { name, email })
      .then((user) => {
        if (user) {
          res.send(user);
        }
        return next(new NotFoundError(errorMessages.notFoundUserErrorMessage));
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequestError(errorMessages.validationErrorMessage));
        }
        if (err.name === 'MongoError' && err.code === 11000) {
          return next(new DataConflictError(errorMessages.constraintErrorMessage));
        }
        return next(err);
      });
  })
    .catch((err) => handleError(err, next));
};
