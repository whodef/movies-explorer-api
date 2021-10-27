const routes = require("express").Router();
const { validateUserCreate, validateLogin } = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/user");
const movieRoutes = require("./movie");
const userRoutes = require("./user");

routes.post("/signup", validateUserCreate, createUser);
routes.post("/signin", validateLogin, login);

routes.use(auth);
routes.use("/movies", movieRoutes);
routes.use("/users", userRoutes);

module.exports = routes;
