require("dotenv").config();
const routes = require("express").Router();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const { errors } = require("celebrate");
const rateLimit = require("express-rate-limit");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const NotFoundError = require("./errors/NotFoundError");
const errorsHandler = require("./middlewares/errorsHandler");
const { errorMessages } = require("./utils/constants");
const auth = require("./middlewares/auth");

const app = express();

const { PORT = 3000 } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

mongoose.connect("mongodb://localhost:27017/moviesdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);
app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes.use(require("./routes/user"));
routes.use(require("./routes/movie"));

app.use(routes);

app.all("*", auth, () => {
  throw new NotFoundError(errorMessages.notFoundRouteErrorMessage);
});

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`Connection successful, port: ${PORT}`); // eslint-disable-line no-console
});
