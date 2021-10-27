require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const NotFoundError = require("./errors/NotFoundError");
const limiter = require("./middlewares/rateLimiter");
const routes = require("./routes/index");
const errorsHandler = require("./middlewares/errorsHandler");
const { errorMessages } = require("./utils/constants");

const app = express();
const { PORT = 3000 } = process.env;

app.use(requestLogger);
app.use(cors());
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

mongoose.connect("mongodb://localhost:27017/moviesdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use((req, res, next) => {
  next(new NotFoundError(errorMessages.notFoundOnSiteErrorMessage));
});

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`Connection successful, port ${PORT}`); // eslint-disable-line no-console
});
