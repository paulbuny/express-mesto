const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");

//Установка порта сервера по умолчанию
const {PORT = 3000} = process.env;
const app = express();

//Подключение к БД
mongoose.connect("mongodb://localhost:27017/mestodb", {
useNewUrlParser: true,
useCreateIndex: true,
useFindAndModify: false,
useUnifiedTopology: true,
});

app.use(helmet());
app.use(express.json());

//Тестовый id пользователя
app.use((req, res, next) => {
  req.user = {
    _id: "607bf55fec690601c049b009"
  };

  next();
})

app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));

app.listen(PORT, () => {
  console.log(`server listen on ${PORT}`);
})