require('dotenv').config();

const express = require('express');
const colors = require('colors');
const routes = require('./src/routes/route');

const PORT = process.env.PORT || 3939;
const app = express();

app.listen(PORT, () => {
	console.debug(`SERVER STARTED ON PORT: ${PORT}`.toLowerCase().rainbow);
});

app.get(routes);
