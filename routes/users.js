const express = require('express');

const routes = express.Router();

const {
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const {
  paramsIdValidation,
  updateUserDataValidation,
  updateUserAvatarValidation,
} = require('../middlewares/requestValidation');

routes.get('/users', getUsers);
routes.get('/users/me', getCurrentUser);
routes.patch('/users/me', updateUserDataValidation, updateProfile);
routes.patch('/users/me/avatar', updateUserAvatarValidation, updateAvatar);
routes.get('/users/:id', paramsIdValidation, getUserById);

module.exports = routes;
