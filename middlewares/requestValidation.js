const { celebrate, Joi } = require('celebrate');

// Валидация params.id
module.exports.paramsIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});

// Валидация данных пользователя
module.exports.userDataValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

// Валидация данных карточки
module.exports.cardDataValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
  }),
});

// Валидация данных при первичкой авторизации
module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

// Валидация данных обновления информации о пользователе
module.exports.updateUserDataValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

// Валидация данных обновления аватара пользователя
module.exports.updateUserAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
});
