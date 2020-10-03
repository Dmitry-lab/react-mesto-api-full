const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { findAllUsers, findUser, updateUserInfo, updateUserAvatar, findMe } = require('../controllers/users');

const router = express.Router();

router.get('/', findAllUsers);
router.get('/me', findMe);
router.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().alphanum(),
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
    avatar: Joi.string().required(),
  }),
}), updateUserAvatar);

module.exports = router;
