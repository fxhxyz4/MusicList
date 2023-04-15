import dotenv from 'dotenv';
  dotenv.config();

import express from 'express';
import colors from 'colors';
import path from 'path';
import cors from 'cors';
import ejs from 'ejs';

import router from './routes/router.js';

const app = express();

// dotenv config
const REDIRECT_URI = process.env.REDIRECT_URI,
      TWITCH_ID = process.env.TWITCH_ID,
      AUTH_URL = process.env.AUTH_URL,
      PORT = process.env.PORT;

const URI_ENCODE = encodeURIComponent(REDIRECT_URI);

const TWITCH_URL = `${AUTH_URL}?response_type=code&redirect_uri=${URI_ENCODE}/&client_id=${TWITCH_ID}`
const token_uri = 'https://accounts.spotify.com/api/token';

const public_path = `./public/`;
const __dirname = path.dirname(public_path);

app.set('view engine', 'ejs');
app.engine('ejs', ejs.__express);

// middlewares
app.use(cors());
app.use(express.static(__dirname));

// routes
app.use('/', router);

app.use('/auth/twitch', (req, res, next) => {
	res.redirect(TWITCH_URL);
  next();
});

app.get('*', (req, res) => {
  res.render('404');
});

app.listen(PORT, () => {
	if (process.env.PORT != 3939) return console.error(`[error] incorrect port`.red);
	return console.debug(`Server started on PORT: ${PORT}`.toLowerCase().rainbow);
});
