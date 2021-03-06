const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const RequestError = require('../errors/request-error');
const ConflictError = require('../errors/conflict-error');

const SALT_ROUNDS = 10;
const LOCAL_KEY = '479f6120aa76a2ac2211367c8a3a88de940057af25eeacb789502425c98a9800';

module.exports.findAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.findUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректно задан Id пользователя'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.findMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректно задан I пользователя'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name = 'Имя',
    about = 'Обо мне',
    avatar = 'https://klike.net/uploads/posts/2019-03/1551511801_1.jpg',
    email,
    password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then(() => {
      res.status(201).send({ data: { name, about, avatar, email } });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(`Ошибка создания пользователя ${err} Проверьте корректность переданных данных.`));
      } else if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError(`Ошибка создания пользователя ${err} пользователь с таким email уже существует.`));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const myId = req.user._id;

  User.findByIdAndUpdate(myId, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(`Ошибка создания пользователя ${err} Проверьте корректность переданных данных.`));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const myId = req.user._id;

  User.findByIdAndUpdate(myId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(`Ошибка создания пользователя ${err} Проверьте корректность переданных данных.`));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  User.findUserByCreditians(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : LOCAL_KEY,
        { expiresIn: '7d' },
      );

      res.send({ token });
      // res.cookie('jwt', token, { httpOnly: true }).end();
    })
    .catch(next);
};
