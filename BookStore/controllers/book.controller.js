const booksTable = require('../models/book.model');
const db = require('../db/index');
const { eq, ilike } = require('drizzle-orm');

exports.createNewBook = async (req, res) => {
    try {
        const { title, authorId, description } = req.body;

        if (!title || title.trim() === '') {
            return res.status(400).json({ error: 'Title is required' });
        }

        const [newBook] = await db.insert(booksTable).values({
            title,
            authorId,
            description,
        }).returning({ id: booksTable.id });

        return res.status(201).json({ message: 'Book created successfully', id: newBook.id });
    } catch (error) {
        console.error('Error creating book:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getAllBooks = async (req, res) => {
    const search = req.query.search;

    try {

        if (search) {
            const books = await db
                .select()
                .from(booksTable)
                .where(ilike(booksTable.title, `%${search}%`));
            return res.json(books);
        }

        const books = await db.select().from(booksTable);
        return res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getBookById = async (req, res) => {
    try {
        const id = req.params.id;

        const [book] = await db.select()
            .from(booksTable)
            .where(eq(booksTable.id, id))
            .limit(1);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' }); // Changed 400 to 404
        }

        return res.status(200).json({ message: 'Book found', data: book });
    } catch (error) {
        console.error('Error fetching book:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.deleteBookById = async (req, res) => {
    try {
        const id = req.params.id;

        // Use .returning() to check if a row was actually deleted
        const [deletedBook] = await db.delete(booksTable)
            .where(eq(booksTable.id, id))
            .returning({ id: booksTable.id });

        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.updateBookById = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, description } = req.body;

        const [updatedBook] = await db.update(booksTable)
            .set({ title, description })
            .where(eq(booksTable.id, id))
            .returning();

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        return res.status(200).json({ message: 'Book updated successfully', data: updatedBook });
    } catch (error) {
        console.error('Error updating book:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}