const Movie = require("../models/movie");
const { serverMessages } = require("../utils/constants");

module.exports.getAllMovies = async (req, res, next) => {
  const moviesList = await Movie.find({})
    .catch(next);
  res.send({
    data: moviesList
  });
};

module.exports.createNewMovie = async (req, res, next) => {
  const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId } = req.body;
  const owner = req.user;
  const newMovieEntry = await Movie
    .create({ country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId, owner })
    .catch(next);

  res.send({
    data: newMovieEntry
  });
};

module.exports.deleteMovie = async (req, res, next) => {
  const { movieId } = req.params;

  await Movie.checkMovieEntryOwner(movieId, req.user)
    .catch(next);

  await Movie.deleteOne({ _id: movieId })
    .catch(next);

  res.send({
    message: serverMessages.movieDeleteMessage
  });
};
