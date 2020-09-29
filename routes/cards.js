const express = require('express');
const { findAllCards, findAndDeleteCard, createCard, putLike, deleteLike } = require('../controllers/cards');

const router = express.Router();

router.post('/', createCard);
router.get('/', findAllCards);
router.delete('/:id', findAndDeleteCard);
router.put('/:id/likes', putLike);
router.delete('/:id/likes', deleteLike);

module.exports = router;
