const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { findAllUsers, findUser, updateUserInfo, updateUserAvatar, findMe } = require('../controllers/users');

const router = express.Router();
const validUrl = new RegExp('https?:\\/\\/(?:www\\.|(?!www))[a-z0-9][a-z0-9-]+[a-z0-9]\\.[^\\s]{2,}|www\\.[a-z0-9][a-z0-9-]+[a-z0-9]\\.[^\\s]{2,}'
+ '|https?:\\/\\/(?:www\\.|(?!www))[a-z0-9]+\\.[^\\s]{2,}|www\\.[a-z]+\\.[^\\s]{2,}', 'gi');

router.get('/', findAllUsers);
router.get('/me', findMe);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex(),
  }),
}), findUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi
      .string()
      .custom((value, helper) => {
        if (validUrl.test(value)) {
          return value;
        }
        return helper.message('Некорректный формат URL-адреса');
      }),
  }),
}), updateUserAvatar);

module.exports = router;
