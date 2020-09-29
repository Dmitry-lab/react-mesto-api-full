const Card = require('../models/card');

module.exports.findAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: `Ошибка сервера ${err}` }));
};

module.exports.findAndDeleteCard = (req, res) => {
  const _id = req.params.id;

  Card.findByIdAndDelete(_id)
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Некорректно задан Id карточки ${err}` });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link, likes, createdAt } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId, likes, createdAt})
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: `Ошибка создания карточки ${err} Проверьте корректность переданных данных.` });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

module.exports.putLike = (req, res) => {
  const _id = req.params.id;
  const ownerId = req.user._id;

  Card.findByIdAndUpdate(_id, { $addToSet: { likes: ownerId } }, { new: true })
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Некорректно задан Id карточки ${err}` });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};

module.exports.deleteLike = (req, res) => {
  const _id = req.params.id;
  const ownerId = req.user._id;

  Card.findByIdAndUpdate(_id, { $pull: { likes: ownerId } }, { new: true })
    .orFail()
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        res.status(404).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: `Некорректно задан Id карточки ${err}` });
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(500).send({ message: `Ошибка сервера ${err}` });
      }
    });
};
