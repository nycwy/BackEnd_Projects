const express = require('express');
const controller = require('../controllers/author.controller');
const router = express.Router();

router.get('/', controller.getAuthor);
router.get('/:id', controller.getAuthorById);

router.post('/', controller.createAuthor);

module.exports = router;