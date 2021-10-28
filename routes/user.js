const userRoutes = require("express").Router();
const {
  createUser, login, findAuthUser, updateProfile,
} = require("../controllers/user");
const {
  validateEmptyBodyRequest, validateProfileUpdate, validateUserCreate, validateLogin,
} = require("../middlewares/validate");
const auth = require("../middlewares/auth");

userRoutes.post("/signup", validateUserCreate, createUser);
userRoutes.post("/signin", validateLogin, login);

userRoutes.get("/users/me", auth, validateEmptyBodyRequest, findAuthUser);
userRoutes.patch("/users/me", auth, validateProfileUpdate, updateProfile);

module.exports = userRoutes;
