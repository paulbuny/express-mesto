const User = require("../models/user");

//Получить всех пользователей
module.exports.getUsers = (req, res) => {
  User.find({})
  .then((Users) => res.send(Users))
  .catch(() => res.status(500).send({message: "Что-то пошло не так."}))
};

//Получить данные об одном пользователе по _id
module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
  .orFail(new Error('NotValidId'))
  .then((user) => res.send(user))
  .catch((err) => {
    if(err.message === 'NotValidId') {
      res.status(404).send({message: "Пользователь по указанному _id не найден."});
    } else if (err.name === 'CastError') {
      res.status(400).send({message: "_id пользователя не валиден"});
    } else {
      res.status(500).send({message: "Что-то пошло не так."});
    }
  });
}

//Создать нового пользователя
module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
  .then((user) => res.send(user))
  .catch((err) => {
    if(err.name === "ValidationError") {
      res.status(400).send({message: "Переданы некорректные данные при создании пользователя."});
    } else {
      res.status(500).send({message: "Что-то пошло не так."});
    }

  })
}

//Обновить данные пользователя
module.exports.updateProfile = (req, res) => {
  const id = req.user._id;
  const {name, about} = req.body;
  User.findByIdAndUpdate(
    id,
    {name, about},
    {runValidators: true, new: true})
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(404).send({message: "Пользователь с указанным _id не найден"})
      } else if (err.name === 'ValidationError') {
        res.status(400).send({message: "Переданы некорректные данные при обновлении профиля"});
      } else {
        res.status(500).send({message: "Что-то пошло не так."})
      }
    })

  }

  //Обновить аватар пользователя
  module.exports.updateAvatar = (req, res) => {
    const id = req.user._id;
    const {avatar} = req.body;

    User.findByIdAndUpdate(
      id,
      {avatar},
      {runValidators: true, new: true})
      .orFail(new Error ('NotValidId'))
      .then((user) => res.send(user))
      .catch((err) => {
        if(err.message === 'NotValidId') {
          return res.status(404).send({message: "Пользователь с указанным _id не найден."})
        } else if (err.name === 'ValidationError'){
          res.status(400).send({message: "Переданы некорректные данные при обновлении аватара."})
        } else {
          res.status(500).send({message: "Что-то пошло не так."})
        }
      })
    }