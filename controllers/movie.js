const Movie = require('../models/movie.js');
const { serverMessages, errorMessages } = require('../utils/constants.js');

module.exports.getAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(() => {
      throw new errorMessages.ServerErrorMessage();
    })
    .catch(next);
};

module.exports.createNewMovie = async (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((data) => {
      res.send(data);
    })
    .catch(next);
};

module.exports.deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;

  Movie.checkMovieEntryOwner(movieId, req.user)
    .then(() => {
      Movie.findByIdAndDelete(movieId)
        .then(() => {
          res.send({
            message: serverMessages.movieDeleteMessage,
          });
        })
        .catch(next);
    })
    .catch(next);
};
