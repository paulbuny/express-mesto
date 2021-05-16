/* eslint-disable consistent-return */
const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const AuthErr = require('../errors/AuthErr');

module.exports = (req, res, next) => {
  const authorization = req.headers;
  console.log(`###HEADERS ${req.headers}`);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new AuthErr('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'super-secret-key'}`);
  } catch (err) {
    throw new AuthErr('Необходима авторизация');
  }

  req.user = payload;

  next();
};
