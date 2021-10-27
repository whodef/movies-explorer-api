const validator = require("validator");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const AuthorizationError = require("../errors/AuthorizationError");
const { errorMessages } = require("../utils/constants");

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
      message: "Введите корректный e-mail",
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

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new AuthorizationError(errorMessages.authorizationErrorMessageLogin));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new AuthorizationError(errorMessages.authorizationErrorMessageLogin),
          );
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
