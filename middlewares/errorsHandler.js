const { errorMessages } = require('../utils/constants.js');

const errorsHandler = (err, req, res, next) => {
  const { errCode = 500, message = errorMessages.ServerErrorMessage } = err;
  res.status(errCode).send({ message });
  console.log(err); // eslint-disable-line no-console
  next();
};

module.exports = errorsHandler;
