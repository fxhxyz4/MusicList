import dotenv from 'dotenv';
dotenv.config();

import OAuth2Strategy from 'passport-oauth2';
import session from 'express-session';
import passport from 'passport';
import express from 'express';
import colors from 'colors';
import path from 'path';
import ejs from 'ejs';

import router from './routes/router.js'

OAuth2Strategy.OAuth2Strategy;
const app = express();

// .env config
const SESSION_SECRET = process.env.SESSION_SECRET,
      TWITCH_SECRET = process.env.TWITCH_SECRET,
      CALLBACK_URL = process.env.CALLBACK_URL,
      TWITCH_ID = process.env.TWITCH_ID,
      TOKEN_URL = process.env.TOKEN_URL,
      AUTH_URL = process.env.AUTH_URL,
      SCOPE = process.env.SCOPE,
      PORT = process.env.PORT

const public_path = `./public/`;
const __dirname = path.dirname(public_path);

app.set('view engine', 'ejs');
app.engine('ejs', ejs.__express);

// middlewares
app.use(session
  ({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(express.static(__dirname));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', router)

OAuth2Strategy.prototype.userProfile = function(accessToken, done) {
  var options = {
    url: 'https://api.twitch.tv/helix/users',
    method: 'GET',
    headers: {
      'Client-ID': TWITCH_ID,
      'Accept': 'application/vnd.twitchtv.v5+json',
      'Authorization': 'Bearer ' + accessToken
    }
  };

  request(options, (error, response, body) => {
    if (response && response.statusCode == 200) {
      done(null, JSON.parse(body));
    } else {
      done(JSON.parse(body));
    }
  });
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use('twitch', new OAuth2Strategy({
    authorizationURL: AUTH_URL,
    tokenURL: TOKEN_URL,
    clientID: TWITCH_ID,
    clientSecret: TWITCH_SECRET,
    callbackURL: CALLBACK_URL,
    state: true
  },
  (accessToken, refreshToken, profile, done) => {
    profile.accessToken = accessToken;
    profile.refreshToken = refreshToken;
    done(null, profile);
  }
));

app.get('/auth/twitch',
  passport.authenticate('twitch', { scope: 'user_read' })
);

app.get('/auth/twitch/callback',
  passport.authenticate('twitch',
    { successRedirect: '/', failureRedirect: '/' }
  )
);

app.listen(PORT, () => {
	if (process.env.PORT != 3939) return console.error(`[error] incorrect port`.red);
	return console.debug(`Server started on PORT: ${PORT}`.toLowerCase().rainbow);
});
