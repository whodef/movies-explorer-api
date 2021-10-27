const validator = require("validator");
const { celebrate, Joi } = require("celebrate");
const BadRequestError = require("../errors/BadRequestError");
const { errorMessages } = require("../utils/constants");

const { isURL, isMongoId } = validator;

const helperValid = (value, helpers) => {
  if (isURL(value)) {
    return value;
  }
  return helpers.message("Это поле заполнено некорректно");
};

module.exports.validateEmptyBodyRequest = (req, res, next) => {
  if (Object.keys(req.body).length > 0) {
    throw new BadRequestError(errorMessages.validationErrorMessage);
  }
  next();
};

module.exports.validateMovieIdParams = (req, res, next) => {
  const id = req.params.movieId;
  if (!(isMongoId(id) && id)) {
    throw new BadRequestError(errorMessages.validationErrorMessage);
  }
  next();
};

module.exports.validateMovieCreate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().regex(/[\wа-яё\s]/i).min(3).max(60).required(),
    director: Joi.string().regex(/[\wа-яё\s]/i).required(),
    duration: Joi.number().required(),
    year: Joi.string().min(2).max(4).required(),
    description: Joi.string().regex(/[\wа-я.:!?"«»;@%№()*#,ё\s]/i).required(),
    image: Joi.string().custom(helperValid).required(),
    trailer: Joi.string().custom(helperValid).required(),
    thumbnail: Joi.string().custom(helperValid).required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().regex(/[а-я.:!?"«»;@%№()*#,ё\s]/i).required(),
    nameEN: Joi.string().regex(/[\w.:!?"«»;@%№()*#,\s]/i).required(),
  })
});

module.exports.validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  })
});

module.exports.validateUserCreate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(30).required(),
    name: Joi.string().min(2).max(30).required(),
  })
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
  })
});
