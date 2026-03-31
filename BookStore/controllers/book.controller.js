const booksTable = require('../models/book.model');
const db = require('../db/index');
const { eq } = require('drizzle-orm');

exports.createNewBook = async (req, res) => {
    const { title, authorId, description } = req.body;
    if (!title || title === '') {
        return res.status(400).json({ error: 'Title is required' });
    }

    const [newBook] = await db.insert(booksTable).values({
        title,
        authorId,
        description,
    }).returning({ id: booksTable.id });

    res.status(201).json({ message: 'Book created successful', id: newBook.id });
}

exports.getAllBooks = async (req, res) => {
    const books = await db.select().from(booksTable);
    return res.json(books);
}

exports.getBookById = async (req, res) => {
    const id = req.params.id;
    const [book] = await db.select().from(booksTable).where((table) => eq(table.id, id)).limit(1);
    if (!book) {
        return res.status(400).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book found', data: book });
}

exports.deleteBookById = async (req, res) => {
    const id = req.params.id;

    await db.delete(booksTable).where(eq(booksTable.id, id));
    return res.status(200).json({message: 'Book deleted successfully'});
}

exports.updateBookById = async (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;

    const updatedBook = await db.update(booksTable).set({ title, description }).where(eq(booksTable.id, id)).returning();

    res.status(200).json({ message: 'Book updated successfully', data: updatedBook[0] });
}