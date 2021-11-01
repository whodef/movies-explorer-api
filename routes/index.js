const router = require('express').Router();
const userRoutes = require('./user.js');
const movieRoutes = require('./movie.js');
const { validateLogin, validateUserCreate } = require('../middlewares/validate.js');
const { createUser, login } = require('../controllers/user.js');
const auth = require('../middlewares/auth.js');

router.post('/signup', validateUserCreate, createUser);
router.post('/signin', validateLogin, login);

router.use('/users', auth, userRoutes);
router.use('/movies', auth, movieRoutes);

module.exports = router;
