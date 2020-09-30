const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SALT_ROUNDS = 10;
const SECRET_KEY = '479f6120aa76a2ac2211367c8a3a88de940057af25eeacb789502425c98a9800';

module.exports.findAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: `Ошибка сервера ${err}` }));
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Некорректно задан Id пользователя ${err}` });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка создания пользователя ${err} Проверьте корректность переданных данных.` });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { about } = req.body;
  const myId = req.user._id;

  User.findByIdAndUpdate(myId, { about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка обновления информации пользователя ${err} Проверьте корректность переданных данных.` });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const myId = req.user._id;

  User.findByIdAndUpdate(myId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка обновления информации пользователя ${err} Проверьте корректность переданных данных.` });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCreditians(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_KEY,
        { expiresIn: '7d' },
      );

      // res.send(token);
      res.cookie('jwt', token, { httpOnly: true }).end();
    })
    .catch((err) => {
      res.status(401).send({ message: `Ошибка авторизации ${err}`});
    });
};
