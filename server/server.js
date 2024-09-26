const express = require('express');
const cors = require('cors');
const { title } = require('process');
const app = express();
const port = 3000;
app.use('/', express.static('public'));

app.use(cors());


app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.use('/',express.static('public'));
const budget = require('./budget.json');

app.get('/budget', (req, res) => {
    res.json(budget);
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});