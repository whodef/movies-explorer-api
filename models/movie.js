const mongoose = require('mongoose');
const validator = require('validator');
const NotFoundError = require('../errors/NotFoundError.js');
const { errorMessages } = require('../utils/constants.js');

const { isURL } = validator;

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    minlength: 2,
    required: true,
  },
  director: {
    type: String,
    minlength: 2,
    required: true,
  },
  duration: {
    type: Number,
    minlength: 2,
    required: true,
  },
  year: {
    type: String,
    minlength: 2,
    required: true,
  },
  description: {
    type: String,
    minlength: 2,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return isURL(v);
      },
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return isURL(v);
      },
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return isURL(v);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    minlength: 2,
    required: true,
    validate: {
      validator(v) {
        return /[а-я.:!?"«»;@%№()*#,ё\s]/gi.test(v);
      },
    },
  },
  nameEN: {
    type: String,
    minlength: 2,
    required: true,
    validate: {
      validator(v) {
        return /[\w.:!?"«»;@%№()*#,\s]/gi.test(v);
      },
    },
  },
});

/* Настройки JSON-сериализатора */
movieSchema.options.toJSON = {
  getters: false,
  virtuals: false,
  minimize: false,
  transform(doc, ret) {
    return ret;
  },
};

// eslint-disable-next-line func-names
movieSchema.statics.checkMovieEntryOwner = function (id, user) {
  return this.findOne({
    _id: id,
    owner: user,
  })
    .then((movie) => {
      if (!movie) {
        return Promise.reject(new NotFoundError(errorMessages.notFoundErrorDBMessage));
      }
      return movie;
    });
};

module.exports = mongoose.model('movie', movieSchema);
