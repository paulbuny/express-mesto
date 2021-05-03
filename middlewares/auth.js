/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const AuthErr = require('../errors/AuthErr');

const JWT_SECRET = '18c9ba303455bfb26cc99c2d1df102977095f92da872a2240cf10bf22723d15a';

module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization) {
    throw new AuthErr('Необходима авторизация');
  }

  const token = authorization;
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new AuthErr('Необходима авторизация');
  }

  req.user = payload;

  next();
};
