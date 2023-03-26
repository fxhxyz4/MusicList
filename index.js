require('dotenv').config();

const express = require('express');
const colors = require('colors');

const PORT = process.env.PORT || 3939;
const app = express();

app.listen(PORT, () => {
	console.debug(`runned on port: ${PORT}`.toLowerCase().rainbow);
});

app.get('/', (req, res) => {
	res.send('./src/index.ejs');
	res.sendStatus(200);
});
