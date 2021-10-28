const movieRoutes = require("express").Router();
const { getAllMovies, createNewMovie, deleteMovie } = require("../controllers/movie");
const { validateEmptyBodyRequest, validateMovieCreate, validateMovieIdParams } = require("../middlewares/validate");
const auth = require("../middlewares/auth");

movieRoutes.get("/movies", auth, validateEmptyBodyRequest, getAllMovies);
movieRoutes.post("/movies", auth, validateMovieCreate, createNewMovie);
movieRoutes.delete("/movies/:movieId", auth, validateEmptyBodyRequest, validateMovieIdParams, deleteMovie);

module.exports = movieRoutes;
