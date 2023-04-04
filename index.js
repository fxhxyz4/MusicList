import dotenv from 'dotenv';
  dotenv.config();

import { OAuth2Strategy } from 'passport-oauth';
import session from 'express-session';
import passport from 'passport';
import express from 'express';
import colors from 'colors';
import path from 'path';
import cors from 'cors';
import ejs from 'ejs';

import router from './routes/router.js';

const app = express();

// dotenv config
const SESSION_SECRET = process.env.SESSION_SECRET,
      SPOTIFY_SECRET = process.env.SPOTIFY_SECRET,
	    SPOTIFY_ID = process.env.SPOTIFY_ID,
      TWITCH_ID = process.env.TWITCH_ID,
      AUTH_URL = process.env.AUTH_URL,
      PORT = process.env.PORT

const public_path = `./public/`;
const __dirname = path.dirname(public_path);

app.set('view engine', 'ejs');
app.engine('ejs', ejs.__express);

// spotify

// middlewares
app.use(passport.initialize({}));
app.use(session
  ({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(cors());
app.use(express.static(__dirname));

// routes
app.use('/', router);

app.use('/auth/twitch', (req, res, next) => {
	res.redirect(`${AUTH_URL}?response_type=code&redirect_uri=https%3A%2F%2Fmusic-list-lol.onrender.com/&client_id=${TWITCH_ID}`);
  if(res?.type === "success") {
    console.log(res)
  }
  next();
});

app.get('*', (req, res) => {
  res.render('404');
});

app.listen(PORT, () => {
	if (process.env.PORT != 3939) return console.error(`[error] incorrect port`.red);
	return console.debug(`Server started on PORT: ${PORT}`.toLowerCase().rainbow);
});
