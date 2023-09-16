import dotenv from 'dotenv';

import session from 'express-session';
import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import helmet from 'helmet';
import axios from 'axios';
import path from 'path';
import cors from 'cors';
import ejs from 'ejs';

const environment = process.env.NODE_ENV;

const dotenvFile = `.env`;
dotenv.config({ path: dotenvFile });

const dotenvNode = `.env.${environment}`;
dotenv.config({ path: dotenvNode });

const app = express();

global.statusCode;
global.statusMsg;

const {
  PORT,
  HOST,
  TITLE,
  AUDD_URI,
  TWITCH_ID,
  AUDD_TOKEN,
  SPOTIFY_ID,
  AUTH_TWITCH,
  SESSION_NAME,
  AUTH_SPOTIFY,
  REDIRECT_URI,
  SPOTIFY_SECRET,
  SESSION_SECRET,
} = process.env;

const URI_ENCODE = encodeURIComponent(REDIRECT_URI);
const TWITCH_URL = `${AUTH_TWITCH}?response_type=code&redirect_uri=${URI_ENCODE}&client_id=${TWITCH_ID}`

const authParams = `${SPOTIFY_ID}:${SPOTIFY_SECRET}`;
const encodedAuthParams = Buffer.from(authParams).toString('base64');

const publicPath = `./public/`;
const __dirname = path.dirname(publicPath);

const requestBody = new URLSearchParams();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejs.__express);

app.use(cors());

app.enable('trust proxy');
app.disable('x-powered-by');

app.use(session({
  secret: SESSION_SECRET,
  name: SESSION_NAME,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 10 * 676e9,
  }
}));

app.use(express.json());
app.use(express.static(__dirname));

app.use(morgan('common'));

app.get('/', (req, res) => {
  res.render('index', {
    title: TITLE
  });
});

app.post('/', async (req, res, next) => {
  const trackName = req.body.track;
  let tracks;

  try {
    if (!trackName) {
      console.error(`[error] trackName ${undefined} or ${null}`.red);
      res.redirect(`/error?status=500&message=trackName ${undefined} or ${null}`);
    } else {
      tracks = await searchTracks(trackName);
      res.send({ tracks })
    }
  } catch (e) {
    global.statusCode = 500;
    global.statusMsg = e;

    console.error(`[error] ${e}`.red);
    res.redirect(`/error?status=500&message=${e}`);
  }
});

app.get('/auth/twitch', (req, res, next) => {
  try {
    res.redirect(TWITCH_URL);
  } catch (e) {
    global.statusCode = 500;
    global.statusMsg = e;

    console.error(`[error] ${e}`.red);
    res.redirect(`/error?status=500&message=${e}`);
  }
});

app.get('/error', (req, res, next) => {
  global.statusCode = req.query.status;
  global.statusMsg = req.query.message;

  res.render('error', {
    statusCode: statusCode,
    message: statusMsg,
  });
});

app.get('/auth/twitch/callback', (req, res, next) => {
  try {
    if (req.query.code) {
      const authCode = req.query.code;
      res.send({ login: true, code: authCode });
    } else {
      next();
    }
  } catch (e) {
    global.statusCode = 500;
    global.statusMsg = e;

    console.error(`[error] ${e}`.red);
    res.redirect(`/error?status=${statusCode}&message=${statusMsg}`);
  }
}, (req, res, next) => {
    global.statusCode = req.query.status;
    global.statusMsg = req.query.message;

    res.render('error', {
      statusCode: statusCode,
      message: statusMsg,
  });
});

async function searchTracks(trackName) {
  requestBody.append('grant_type', 'client_credentials');

  const r = await axios(`${AUTH_SPOTIFY}?`, {
		method: 'post',
		headers: {
			Authorization: `Basic ${encodedAuthParams}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		data: requestBody.toString(),
	});

	const token = await r.data.access_token;

    try {
      const r = await axios(`https://api.spotify.com/v1/search?type=track&q=${trackName}&limit=15`, {
        method: 'get',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const tracks = await r.data.tracks;
      const trackNames = tracks.items.map(item => item.name);

      // const dmcaResults = await checkDMCA(trackNames);
      // return dmcaResults;

      return tracks;
    } catch (e) {
      console.error(`[error] ${e}`.red);
    }
}

// async function checkDMCA(tracksName) {
//   const MB_API_URL = 'https://musicbrainz.org/ws/2';

//   try {
//     const response = await axios.get(`${MB_API_URL}/recording`, {
//       params: {
//         query: tracksName,
//         limit: 1,
//         fmt: 'json',
//       },
//     });

//     const recordings = response.data.recordings;
//     console.log(recordings);

//     return recordings;
//   } catch (e) {
//     console.error(`[error] ${e}`.red);
//   }
// }

app.get('/robots.txt', (req, res) => {
  res.type("text/plain");
  res.sendFile(path.resolve('./public/robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.type("application/xml");
  res.sendFile(path.resolve('./public/sitemap.xml'));
});

app.get('*', (req, res) => {
  res.render('404');
});

app.listen(PORT, () => {

  if (!PORT) {
    console.error(`[error] incorrect port`.red);
    return;
  }

  console.debug(
    `[server] Server started on ${HOST}:${PORT}`.toLowerCase().rainbow
  );
});
