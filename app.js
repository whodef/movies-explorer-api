require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes/index.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const NotFoundError = require('./errors/NotFoundError.js');
const errorsHandler = require('./middlewares/errorsHandler.js');
const { errorMessages } = require('./utils/constants.js');
const limiter = require('./middlewares/limiter.js');
const config = require('./config/config.js');

const app = express();

mongoose.connect(config.mongo_dsn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

const corsOptions = {
  origin: true,
  credentials: true
}

// var corsOptionsDelegate = function (req, callback) {
//   var corsOptions;
//   if (allowlist.indexOf(req.header('Origin')) !== -1) {
//     corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
//   } else {
//     corsOptions = { origin: false } // disable CORS for this request
//   }
//   callback(null, corsOptions) // callback expects two parameters: error and options
// }

app.use(cors(corsOptions));

app.post(limiter);

app.use(helmet());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.use((req, res, next) => {
  next(new NotFoundError(errorMessages.notFoundRouteErrorMessage));
});

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

app.listen(config.port, () => {
  console.log(`Connection successful, port: ${config.port}`); // eslint-disable-line no-console
});
