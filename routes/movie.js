const movieRoutes = require('express').Router();
const { getAllMovies, createNewMovie, deleteMovie } = require('../controllers/movie.js');
const { validateMovieCreate, validateMovieDelete } = require('../middlewares/validate.js');

movieRoutes.get('/', getAllMovies);
movieRoutes.post('/', validateMovieCreate, createNewMovie);
movieRoutes.delete('/:movieId', validateMovieDelete, deleteMovie);

module.exports = movieRoutes;
