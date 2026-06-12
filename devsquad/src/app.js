const express = require('express');
const app = express();

app.use((req, res) => {
    res.send("Hello welcome from the server");
});

app.listen(3000, () => {
    console.log("Server is up and running!");
});
