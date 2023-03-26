require('dotenv').config();

const express = require('express');
const colors = require('colors');

const PORT = process.env.PORT || 3939;
const app = express();

app.listen(PORT, () => {
	if (!process.env.PORT) console.error(`error`.red);
	console.debug(`SERVER STARTED ON PORT: ${PORT}`.toLowerCase().rainbow);
});

app.get('*', (req, res) => {
	res.send('./src/index.ejs');
	res.status(200);
});
