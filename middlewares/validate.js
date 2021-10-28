const validator = require("validator");
const { celebrate, Joi } = require("celebrate");
const { errorMessages } = require("../utils/constants");
const BadRequestError = require("../errors/BadRequestError");

const { isURL, isMongoId } = validator;

const isUrlCustomValidator = (value, helpers) => (isURL(value) ? value : helpers.message("Это поле заполнено некорректно, ожидается URL") && false);

const isMongoIdCustomValidator = (value, helpers) => (isMongoId(value) ? value : helpers.message("Это поле заполнено некорректно, ожидается строка в формате MongoDB ID") && false);

module.exports.validateEmptyBodyRequest = (req, res, next) => {
  if (Object.keys(req.body).length > 0) {
    throw new BadRequestError(errorMessages.validationErrorMessage);
  }
  next();
};

module.exports.validateMovieIdParams = (req, res, next) => {
  const id = req.params.movieId;
  if (!isMongoId(id)) {
    throw new BadRequestError(errorMessages.validationErrorMessage);
  }
  next();
};

module.exports.validateMovieCreate = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().regex(/[\wа-яё\s]/i).min(3)
      .max(60),
    director: Joi.string().required().regex(/[\wа-яё\s]/i),
    duration: Joi.number().required().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required().regex(/[\wа-я.:!?"«»;@%№()*#,ё\s]/i),
    image: Joi.string().required().custom(isUrlCustomValidator),
    trailer: Joi.string().required().custom(isUrlCustomValidator),
    thumbnail: Joi.string().required().custom(isUrlCustomValidator),
    nameRU: Joi.string().required().regex(/[а-я.:!?"«»;@%№()*#,ё\s]/i),
    nameEN: Joi.string().required().regex(/[\w.:!?"«»;@%№()*#,\s]/i),
    movieId: Joi.string().required().custom(isMongoIdCustomValidator),
  }),
});

module.exports.validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports.validateUserCreate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3).max(30),
    name: Joi.string().required().min(2).max(30),
  }),
});

module.exports.validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
});
