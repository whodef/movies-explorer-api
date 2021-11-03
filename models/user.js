const validator = require('validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const AuthorizationError = require('../errors/AuthorizationError.js');
const { errorMessages } = require('../utils/constants.js');
const DataConflictError = require('../errors/DataConflictError.js');

const { isEmail } = validator;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return isEmail(v);
      },
      message: errorMessages.validationErrorMessage,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
});

/* Настройки JSON-сериализатора (для удаления хеша пароля) */
userSchema.options.toJSON = {
  getters: false,
  virtuals: false,
  minimize: false,
  transform(doc, ret) {
    delete ret.password; // eslint-disable-line no-param-reassign
    return ret;
  },
};

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw Promise.reject(
          new AuthorizationError(errorMessages.authorizationErrorMessageLogin),
        );
      }

      return bcrypt.compare(password, user.password)

        .then((matched) => {
          if (!matched) {
            throw Promise.reject(
              new AuthorizationError(errorMessages.authorizationErrorMessageLogin),
            );
          }

          return user;
        });
    })
    .catch((err) => err);
};

// eslint-disable-next-line func-names
userSchema.statics.checkEmailDuplicate = function (email) {
  return this.findOne({ email })
    .then((user) => {
      if (user) {
        throw Promise.reject(new DataConflictError(errorMessages.emailConflictErrorMessage));
      }
    })
    .catch((err) => err);
};

module.exports = mongoose.model('user', userSchema);
