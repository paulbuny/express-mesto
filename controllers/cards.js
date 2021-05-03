/* eslint-disable consistent-return */
const ForbiddenErr = require('../errors/ForbiddenErr');
const ValidationErr = require('../errors/ValidationErr');
const NotFoundErr = require('../errors/NotFoundErr');

const Card = require('../models/card');

// Получить все карточки
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// Создать карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationErr('Переданы некорректные данные при создании карточки.');
      }
    })
    .catch(next);
};

// Удалить карточку
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundErr('Карточка с указанным _id не найдена');
      }

      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenErr('Вы не можете удалять чужие карточки');
      }
      Card.findByIdAndRemove(req.params.id)
        .then((item) => res.send(item))
        .catch(next);
    })
    .catch(next);
};

// Добавить лайк карточке
module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundErr('Карточка с указанным _id не найдена'))
    .then((card) => res.send(card))
    .catch(next);
};

// Убрать лайк с карточки
module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundErr('Карточка с указанным _id не найдена.'))
    .then((card) => res.send(card))
    .catch(next);
};
