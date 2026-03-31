const express = require('express');
const controller = require('../controllers/book.controller');
const router = express.Router();

//Create
router.post('/', controller.createNewBook);

//Read
router.get('/', controller.getAllBooks);
router.get('/:id', controller.getBookById);

//Update
router.put('/:id', controller.updateBookById);

//Delete
router.delete('/:id', controller.deleteBookById);

module.exports = router;