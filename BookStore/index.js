const express = require('express');
const { loggerMiddleware } = require('./middlewares/logger');
const bookRouter = require('./routes/book.routes');
const authorsRouter = require('./routes/author.routes');
const app = express();

//middlewares
app.use(express.json());
app.use(loggerMiddleware);

// routes
app.use('/books', bookRouter);
app.use('/authors', authorsRouter);

app.listen(8000, () => {
    console.log("Server is running at port 8000");
});