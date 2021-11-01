const movieRoutes = require('express').Router();
const { getAllMovies, createNewMovie, deleteMovie } = require('../controllers/movie.js');
const { validateMovieCreate } = require('../middlewares/validate.js');

movieRoutes.get('/', getAllMovies);
movieRoutes.post('/', validateMovieCreate, createNewMovie);
movieRoutes.delete('/:movieId', deleteMovie);

module.exports = movieRoutes;
