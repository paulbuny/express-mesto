const Card = require('../models/card');

//Получить все карточки
module.exports.getCards = (req, res) => {

    Card.find({})
        .then((cards) => res.send(cards))
        .catch(() => res.status(500).send({message: "Что-то пошло не так."}))
}

//Создать карточку
module.exports.createCard = (req, res) => {
    const { name, link } = req.body;

    if (!name || !link ) {
        res.status(400).send({message: "Переданы некорректные данные при создании карточки."})
    } else {
        Card.create({ name, link, owner: req.user._id })
            .then((card) => res.send(card))
            .catch(() => res.status(500).send({message: "Что-то пошло не так"}))
    }
}

//Удалить карточку
module.exports.deleteCard = (req, res) => {

    Card.findByIdAndRemove(req.params.id)
        .then((card) => res.send(card))
        .catch((err) => {
            if (err.name === "CastError") {
                return res.status(404).send({message: "Карточка с указанным _id не найдена."})
            }
            return res.status(500).send({message: "Что-то пошло не так."})
        })
}

//Добавить лайк карточке
module.exports.putLike = (req, res) => {

    Card.findByIdAndUpdate(
        req.params.id,
        {$addToSet: {likes: req.user._id}},
        {new: true},
    )
        .then((card) => res.send(card))
        .catch((err) => {
            if (err.name === "CastError") {
                return res.status(400).send({message: "Переданы некорректные данные для постановки лайка."})
            }
            return res.status(500).send({message: "Что-то пошло не так."})
        })
}

//Убрать лайк с карточки
module.exports.removeLike = (req, res) => {

    Card.findByIdAndUpdate(
        req.params.id,
        {$pull: {likes: req.user._id}},
        {new: true},
    )
        .then((card) => res.send(card))
        .catch((err) => {
            if (err.name === "CastError") {
                return res.status(400).send({message: "Переданы некорректные данные для снятия лайка."})
            }
            return res.status(500).send({message: "Что-то пошло не так."})
        });
}