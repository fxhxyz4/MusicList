import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import colors from 'colors';
import path from 'path';
import ejs from 'ejs';

const PORT = process.env.PORT || 3939;
const app = express();

const public_path = `./public`
const __dirname = path.dirname(public_path);

app.set('view engine', 'ejs');
app.engine('ejs', ejs.__express);
app.use(express.static(path.join(__dirname, './public')))

app.get('/', (req, res) => {
	res.render('index');
	// res.sendStatus(200);
});

app.get('*', (req, res) => {
	res.render('404');
	// res.sendStatus(404);
});

app.listen(PORT, () => {
	if (!process.env.PORT) return console.error(`error, incorrect port`.red);
	console.debug(`SERVER STARTED ON PORT: ${PORT}`.toLowerCase().rainbow);
});
