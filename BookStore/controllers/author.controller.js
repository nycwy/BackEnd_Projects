const authorsTable = require('../models/author.model');
const db = require('../db/index');
const { eq } = require('drizzle-orm');

exports.getAuthor = async (req, res) => {
    const author = await db.select().from(authorsTable);
    return res.json(author);
};

exports.getAuthorById = async (req, res) => {
    const [author] = await db.select()
        .from(authorsTable)
        .where(eq(authorsTable.id, req.params.id));
    
    if (!author) {
        return res.status(404).json({ message: 'Author not found' });
    }
    
    return res.status(200).json({ message: author });
}

exports.createAuthor = async (req, res) => {
    const { firstName, lastName, email } = req.body;
    const [newAuthor] = await db
        .insert(authorsTable)
        .values({
        firstName,
        lastName,
        email
    }).returning({ id: authorsTable.id });

    return res.status(201).json({message: 'Author Created successfully', id: newAuthor.id})
}