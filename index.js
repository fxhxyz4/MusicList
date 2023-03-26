require('dotenv').config();

const express = require('express');
const colors = require('colors');
const path = require('path');
const ejs = require('ejs');

const PORT = process.env.PORT || 3939;
const app = express();

app.set('view engine', 'ejs');
app.engine('ejs', ejs.__express);

app.get('/', (req, res) => {
	res.render('index');
	// res.sendStatus(200);
});

app.get('*', (req, res) => {
	res.render('404');
	// res.sendStatus(404);
});

app.listen(PORT, () => {
	if (!process.env.PORT) console.error(`error`.red);
	console.debug(`SERVER STARTED ON PORT: ${PORT}`.toLowerCase().rainbow);
});
