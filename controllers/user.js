const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const NotFoundError = require("../errors/NotFoundError");
const DataConflictError = require("../errors/DataConflictError");
const { errorMessages } = require("../utils/constants");

// Обработчик
const handleError = (err, next) => {
  if (err.name === "CastError") {
    throw new DataConflictError(errorMessages.validationErrorMessage);
  }
  next(err);
};

module.exports.findAuthUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(errorMessages.notFoundUserErrorMessage);
      }
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
          if (err.name === "ValidationError") {
            throw new DataConflictError(errorMessages.validationErrorMessage);
          }
          if (err.name === "MongoError" && err.code === 11000) {
            throw new DataConflictError(errorMessages.emailConflictErrorMessage);
          } else {
            next(err);
          }
        }));
  })
    .catch((err) => {
      handleError(err, next);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET_PROD } = process.env;

      // Может генерировать исключение
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET_PROD : "dev-secret",
        { expiresIn: "7d" },
      );

      res.send({ token });
    })
    .catch(() => {
      throw new DataConflictError(errorMessages.authorizationErrorMessageJWT);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        throw new NotFoundError(errorMessages.notFoundUserErrorMessage);
      }
    })
    .catch((err) => {
      handleError(err, next);
    })
    .catch(next);
};
