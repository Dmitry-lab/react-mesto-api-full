const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { findAllCards, findAndDeleteCard, createCard, putLike, deleteLike } = require('../controllers/cards');

const router = express.Router();

router.get('/', findAllCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required(),
    createdAt: Joi.date(),
    likes: Joi.array().items(Joi.string().alphanum()),
  }),
}), createCard);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().alphanum(),
  }),
}), findAndDeleteCard);

router.put('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().alphanum(),
  }),
}), putLike);

router.delete('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().alphanum(),
  }),
}), deleteLike);

module.exports = router;
