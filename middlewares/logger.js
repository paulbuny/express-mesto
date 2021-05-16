const winston = require('winston');
const experessWinston = require('express-winston');

const reqLogger = experessWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'request.log' }),
  ],
  format: winston.format.json(),
});

const errLogger = experessWinston.logger({
  transports: [
    new winston.transports.File({ filename: 'errors.log' }),
  ],
  format: winston.format.json(),
});

module.exports = {
  reqLogger,
  errLogger,
};
