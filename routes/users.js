const express = require('express');
const { findAllUsers, findUser, createUser, updateUserInfo, updateUserAvatar } = require('../controllers/users');

const router = express.Router();

router.post('/', createUser);
router.get('/', findAllUsers);
router.get('/:id', findUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
