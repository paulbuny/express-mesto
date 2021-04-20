const express = require('express');
const routes = express.Router();

const {
  getCards,
  createCard,
  deleteCard,
  putLike,
  removeLike,
} = require("../controllers/cards");

routes.get("/cards", getCards);
routes.post("/cards", createCard);
routes.delete("/cards/:id", deleteCard);
routes.put("/cards/:id/likes", putLike);
routes.delete("/cards/:id/likes", removeLike);

module.exports = routes;