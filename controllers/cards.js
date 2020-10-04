const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const RequestError = require('../errors/request-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.findAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.findAndDeleteCard = (req, res, next) => {
  const _id = req.params.id;

  Card.findById(_id)
    .orFail()
    .then((card) => {
      const cardOwnerId = Buffer.from(card.owner.id).toString('hex');
      if (cardOwnerId === req.user._id) {
        return Card.findByIdAndDelete(_id);
      }
      return Promise.reject(new ForbiddenError('Карточка не может быть удалаена этим пользователем'));
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректно задан Id карточки'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link, likes, createdAt } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId, likes, createdAt })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(`Ошибка создания карточки ${err} Проверьте корректность переданных данных.`));
      } else {
        next(err);
      }
    });
};

module.exports.putLike = (req, res, next) => {
  const _id = req.params.id;
  const ownerId = req.user._id;

  Card.findByIdAndUpdate(_id, { $addToSet: { likes: ownerId } }, { new: true })
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректно задан Id карточки'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteLike = (req, res, next) => {
  const _id = req.params.id;
  const ownerId = req.user._id;

  Card.findByIdAndUpdate(_id, { $pull: { likes: ownerId } }, { new: true })
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Некорректно задан Id карточки'));
      } else if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Карточка не найдена'));
      } else {
        next(err);
      }
    });
};
