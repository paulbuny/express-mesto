const User = require("../models/user");

//Получить всех пользователей
module.exports.getUsers = (req, res) => {
    User.find({})
        .then((Users) => res.send(Users))
        .catch((err) => res.status(500).send({message: "Что-то пошло не так"}))
};

//Получить данные об одном пользователе по _id
module.exports.getUserById = (req, res) => {
    User.findById(req.params.id)
        .then((user) => res.send(user))
        .catch((err) => {
            if (err.name === 'CastError') {
                return res.status(404).send({message: "Пользователь по указанному _id не найден."});
            }
            return res.status(500).send({message: "Что-то пошло не так"});
        });
}

//Создать нового пользователя
module.exports.createUser = (req, res) => {
    const {name, about, avatar} = req.body;

    User.create({name, about, avatar})
        .then((user) => res.send(user))
        .catch((err) => {
            if(err.name === "ValidationError") {
                return res.status(400).send({message: "Переданы некорректные данные при создании пользователя."})
            }
            return res.status(500).send({message: "Что-то пошло не так"})
        })
}

//Обновить данные пользователя
module.exports.updateProfile = (req, res) => {
    const {name, about} = req.body;

    if( !name || !about) {
        res.status(400).send({message: "Переданы некорректные данные при обновлении профиля"})
    } else {
        User.findByIdAndUpdate(
            req.user._id,
            {name, about},
            {new: true},
        )
            .then((user) => res.send(user))
            .catch((err) => {
                if (err.name === "CastError") {
                    return res.status(404).send({message: "Пользователь с указанным _id не найден"})
                }
                return res.status(500).send({message: "Что-то пошло не так"})
            })
    }
}

//Обновить аватар пользователя
module.exports.updateAvatar = (req, res) => {
    const {avatar} = req.body;

    if (!avatar) {
        res.status(400).send({message: "Переданы некорректные данные при обновлении аватара."})
    } else {
        User.findByIdAndUpdate(
            req.user._id,
            {avatar},
            {new: true},
        )
            .then((user) => res.send(user))
            .catch((err) => {
                if(err.name === "CastError") {
                    return res.status(404).send({message: "Пользователь с указанным _id не найден."})
                }
               return res.status(500).send({message: "Что-то пошло не так"})
            })
    }
}