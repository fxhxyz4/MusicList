import dotenv from 'dotenv';
  dotenv.config();

import express from 'express';
import colors from 'colors';
import axios from 'axios';
import path from 'path';
import cors from 'cors';
import ejs from 'ejs';

const app = express();

const {
  PORT,
  TWITCH_ID,
  SPOTIFY_ID,
  AUTH_SPOTIFY,
  AUTH_TWITCH,
  SPOTIFY_SECRET,
  REDIRECT_URI,
  AUDD_URI,
  AUDD_TOKEN
} = process.env;

const URI_ENCODE = encodeURIComponent(REDIRECT_URI);
const TWITCH_URL = `${AUTH_TWITCH}?response_type=code&redirect_uri=${URI_ENCODE}&client_id=${TWITCH_ID}`

const authParams = `${SPOTIFY_ID}:${SPOTIFY_SECRET}`;
const encodedAuthParams = btoa(authParams);

const publicPath = `./public/`;
const __dirname = path.dirname(publicPath);

const requestBody = new URLSearchParams();

app.set('view engine', 'ejs');
app.engine('ejs', ejs.__express);

app.use(cors());
app.use(express.json())

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/', async (req, res) => {
  const trackName = req.body.track
  let tracks;

  try {
    if (!trackName)
      return console.error(`trackName undefined or null`.red)
    else
      tracks = await searchTracks(trackName);
      res.send({ tracks })
  } catch (e) {
    console.error(`${e}`.red);
  }
})

app.get('/auth/twitch', (req, res, next) => {
	res.redirect(TWITCH_URL);
  next();
});

app.get('/auth/twitch/callback', (req, res) => {
  if (req.query.code) {
    const authorizationCode = req.query.code;
    res.send('lol');
  } else {
    res.send('err');
  }
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

      const dmcaResults = await checkDMCA(trackNames);
      const result = dmcaResults;

      return result;
    } catch (e) {
      console.error(`${e}`.red);
    }
}

async function checkDMCA(tracksName) {
  const MB_API_URL = 'https://musicbrainz.org/ws/2';

  try {
    const response = await axios.get(`${MB_API_URL}/recording`, {
      params: {
        query: tracksName,
        limit: 1,
        fmt: 'json',
      },
    });

    const recordings = response.data.recordings;
    console.log(recordings);

    return recordings;
  } catch (e) {
    console.error(`${e}`.red);
  }
}

app.get('/robots.txt', (req, res) => {
  res.sendFile(path.resolve('./public/robots.txt'));
})

app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.resolve('./public/sitemap.xml'));
})

app.get('*', (req, res) => {
  res.render('404');
});

app.listen(PORT, () => {
	if (PORT != 3939) return console.error(`[error] incorrect port`.red);
	return console.debug(`[server] Server started on PORT: ${PORT}`.toLowerCase().rainbow);
});
