const userRoutes = require('express').Router();
const { findAuthUser, updateProfile } = require('../controllers/user.js');
const { validateProfileUpdate } = require('../middlewares/validate.js');

userRoutes.get('/me', findAuthUser);
userRoutes.patch('/me', validateProfileUpdate, updateProfile);

module.exports = userRoutes;
