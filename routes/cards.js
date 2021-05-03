const express = require('express');

const routes = express.Router();

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  removeLike,
} = require('../controllers/cards');

const {
  paramsIdValidation,
  cardDataValidation,
} = require('../middlewares/requestValidation');

routes.get('/cards', getCards);
routes.post('/cards', cardDataValidation, createCard);
routes.delete('/cards/:id', paramsIdValidation, deleteCard);
routes.put('/cards/:id/likes', paramsIdValidation, putLike);
routes.delete('/cards/:id/likes', paramsIdValidation, removeLike);

module.exports = routes;
