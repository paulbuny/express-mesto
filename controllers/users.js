const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ValidationErr = require('../errors/ValidationErr');
const ConflictErr = require('../errors/ConflictErr');
const NotFoundErr = require('../errors/NotFoundErr');

const JWT_SECRET = '18c9ba303455bfb26cc99c2d1df102977095f92da872a2240cf10bf22723d15a';

// Получить всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((Users) => res.send(Users))
    .catch(next);
};

// Получить данные об одном пользователе по _id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new NotFoundErr('Пользователь по указанному _id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// Получить данные о текущем пользователе
module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundErr('Пользователь по указанному _id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

// Создать нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((user) => res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      }))
      .catch((err) => {
        if (err.code === 11000 || err.name === 'MongoError') {
          throw new ConflictErr('Пользователь с таким email уже существует.');
        } else if (err.name === 'ValidationError') {
          throw new ValidationErr('Переданы некорректные данные при создании пользователя.');
        }
      })
      .catch(next));
};

// Обновить данные пользователя
module.exports.updateProfile = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { runValidators: true, new: true },
  )
    .orFail(new NotFoundErr('Пользователь по указанному _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationErr('Переданы некорректные данные при обновлении профиля');
      }
    })
    .catch(next);
};

// Обновить аватар пользователя
module.exports.updateAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    id,
    { avatar },
    { runValidators: true, new: true },
  )
    .orFail(new NotFoundErr('Пользователь по указанному _id не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new NotFoundErr('Переданы некорректные данные при обновлении аватара.');
      }
    })
    .catch(next);
};

// Авторизация по логину и паролю
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .end();
    })
    .catch(next);
};
