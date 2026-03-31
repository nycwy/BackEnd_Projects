const express = require('express');
const { loggerMiddleware } = require('./middlewares/logger');
const bookRouter = require('./routes/book.routes');
const app = express();

//middlewares
app.use(express.json());
app.use(loggerMiddleware);

// routes
app.use('/books', bookRouter);

app.listen(8000, () => {
    console.log("Server is running at port 8000");
});