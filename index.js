import dotenv from 'dotenv';
import session from 'express-session';
import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import axios from 'axios';
import path from 'path';
import cors from 'cors';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const environment = process.env.NODE_ENV;

dotenv.config({ path: `.env` });
dotenv.config({ path: `.env.${environment}` });

const app = express();

const {
  PORT,
  HOST,
  TITLE,
  NODE_ENV,
  TWITCH_ID,
  SPOTIFY_ID,
  AUTH_TWITCH,
  SESSION_NAME,
  AUTH_SPOTIFY,
  REDIRECT_URI,
  SPOTIFY_SECRET,
  SESSION_SECRET,
} = process.env;

const URI_ENCODE = encodeURIComponent(REDIRECT_URI);
const TWITCH_URL = `${AUTH_TWITCH}?response_type=code&redirect_uri=${URI_ENCODE}&client_id=${TWITCH_ID}`;

const authParams = `${SPOTIFY_ID}:${SPOTIFY_SECRET}`;
const encodedAuthParams = Buffer.from(authParams).toString('base64');

const publicPath = path.join(__dirname, 'public');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejs.__express);

app.use(cors());

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  session({
    secret: SESSION_SECRET,
    name: SESSION_NAME,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 10 * 60 * 60 * 1000, // 10 hours
    },
  })
);

app.use(express.json());
app.use(express.static(publicPath));

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.render('index', {
    title: TITLE,
  });
});

app.post('/', async (req, res) => {
  const trackName = req.body.track;

  try {
    if (!trackName) {
      console.error(`[error] trackName ${undefined} or ${null}`.red);
      return res.redirect(`/error?status=500&message=trackName is undefined or null`);
    }

    const tracks = await searchTracks(trackName);
    res.json({ tracks });
  } catch (e) {
    console.error(`[error] ${e}`.red);
    res.redirect(`/error?status=500&message=${encodeURIComponent(e.message)}`);
  }
});

app.get('/auth/twitch', (req, res) => {
  try {
    res.redirect(TWITCH_URL);
  } catch (e) {
    console.error(`[error] ${e}`.red);
    res.redirect(`/error?status=500&message=${encodeURIComponent(e.message)}`);
  }
});

app.get('/error', (req, res) => {
  const statusCode = req.query.status || 500;
  const statusMsg = req.query.message || 'Unknown error';

  res.status(statusCode).render('error', {
    statusCode,
    message: statusMsg,
  });
});

app.get('/auth/twitch/callback', (req, res) => {
  try {
    if (req.query.code) {
      const authCode = req.query.code;
      return res.json({ login: true, code: authCode });
    }

    const statusCode = req.query.status || 400;
    const statusMsg = req.query.message || 'No authorization code provided';

    res.status(statusCode).render('error', {
      statusCode,
      message: statusMsg,
    });
  } catch (e) {
    console.error(`[error] ${e}`.red);
    res.redirect(`/error?status=500&message=${encodeURIComponent(e.message)}`);
  }
});

async function searchTracks(trackName) {
  const requestBody = new URLSearchParams();
  requestBody.append('grant_type', 'client_credentials');

  try {
    const authResponse = await axios.post(AUTH_SPOTIFY, requestBody.toString(), {
      headers: {
        Authorization: `Basic ${encodedAuthParams}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const token = authResponse.data.access_token;

    const searchResponse = await axios.get(
      `https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(trackName)}&limit=50`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const deepTracks = searchResponse.data.tracks.items.filter(track => track.popularity < 20);
    return deepTracks;
  } catch (e) {
    console.error(`[error] ${e}`.red);
    throw e;
  }
}

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.sendFile(path.resolve(publicPath, 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.resolve(publicPath, 'sitemap.xml'));
});

// 404 handler - MUST be after all other routes
app.use((req, res) => {
  res.status(404).render('404');
});

// Error handling middleware (Express 5)
app.use((err, req, res, next) => {
  console.error(`[error] ${err.stack}`.red);
  res.status(err.status || 500).render('error', {
    statusCode: err.status || 500,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  if (!PORT) {
    console.error(`[error] incorrect port`.red);
    return;
  }

  if (PORT === '3000') {
    console.debug(`[server] Server started on ${HOST}:${PORT}`.toLowerCase().rainbow);
  } else {
    console.debug(`[server] Server started on ${HOST}`.toLowerCase().rainbow);
  }
});
