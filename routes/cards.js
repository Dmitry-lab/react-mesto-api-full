const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { findAllCards, findAndDeleteCard, createCard, putLike, deleteLike } = require('../controllers/cards');

const router = express.Router();
const validUrl = new RegExp('https?:\\/\\/(?:www\\.|(?!www))[a-z0-9][a-z0-9-]+[a-z0-9]\\.[^\\s]{2,}|www\\.[a-z0-9][a-z0-9-]+[a-z0-9]\\.[^\\s]{2,}'
+ '|https?:\\/\\/(?:www\\.|(?!www))[a-z0-9]+\\.[^\\s]{2,}|www\\.[a-z]+\\.[^\\s]{2,}', 'gi');

router.get('/', findAllCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi
      .string()
      .custom((value, helper) => {
        if (validUrl.test(value)) {
          return value;
        }
        return helper.message('Некорректный формат URL-адреса');
      }),
    createdAt: Joi.date(),
    likes: Joi.array().items(Joi.string().hex()),
  }),
}), createCard);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex(),
  }),
}), findAndDeleteCard);

router.put('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex(),
  }),
}), putLike);

router.delete('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex(),
  }),
}), deleteLike);

module.exports = router;
