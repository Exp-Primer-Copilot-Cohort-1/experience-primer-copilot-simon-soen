//Create web server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const port = 8080;

//Connect to DB
const db = require('./db');
const { Comment } = db.models;
db.syncAndSeed();

//Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/comments', async(req, res, next) => {
    try {
        res.send(await Comment.findAll());
    }
    catch(ex) {
        next(ex);
    }
});

app.post('/api/comments', async(req, res, next) => {
    try {
        const comment = await Comment.create(req.body);
        res.send(comment);
    }
    catch(ex) {
        next(ex);
    }
});

app.delete('/api/comments/:id', async(req, res, next) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        await comment.destroy();
        res.sendStatus(204);
    }
    catch(ex) {
        next(ex);
    }
});

//Error Handling
app.use((err, req, res, next) => {
    res.status(500).send({ error: err.message });
});

//Listen
app.listen(port, () => console.log(`listening on port ${port}`));