/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');

const {
  login,
  createUser,
} = require('./controllers/users');

const {
  loginValidation,
  userDataValidation,
} = require('./middlewares/requestValidation');

const NotFoundErr = require('./errors/NotFoundErr');

// Установка порта сервера по умолчанию
const { PORT = 3000 } = process.env;
const app = express();

// Подключение к БД
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.post('/signin', loginValidation, login);
app.post('/signup', userDataValidation, createUser);

app.use(auth);

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use(errors());

app.use('*', () => {
  throw new NotFoundErr('Запрашиваемый ресурс не найден');
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(err.statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });

  next();
});

app.listen(PORT, () => {
  console.log(`server listen on ${PORT}`);
});
