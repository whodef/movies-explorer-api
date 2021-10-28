const Movie = require("../models/movie");
const { serverMessages } = require("../utils/constants");

module.exports.getAllMovies = async (req, res, next) => {
  const moviesList = await Movie.find({})
    .catch(next);
  res.send({
    data: moviesList,
  });
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
      Movie.deleteOne({ movieId })
        .then(() => {
          res.send({
            message: serverMessages.movieDeleteMessage,
          });
        })
        .catch(next);
    })
    .catch(next);
};
