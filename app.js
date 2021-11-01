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

const app = express();

const { PORT = 3000, MONGO_DSN } = process.env;

mongoose.connect(MONGO_DSN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Connection successful, port: ${PORT}`); // eslint-disable-line no-console
});
