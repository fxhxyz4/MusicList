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
  TWITCH_SECRET,
  SPOTIFY_ID,
  AUTH_TWITCH,
  SESSION_NAME,
  AUTH_SPOTIFY,
  REDIRECT_URI,
  SPOTIFY_SECRET,
  SESSION_SECRET,
} = process.env;

const URI_ENCODE = encodeURIComponent(REDIRECT_URI);
const TWITCH_URL = `${AUTH_TWITCH}?response_type=code&redirect_uri=${URI_ENCODE}&client_id=${TWITCH_ID}&scope=user:read:email`;

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
      maxAge: 10 * 60 * 60 * 1000,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(publicPath));

app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.render('index', {
    title: TITLE,
  });
});

app.post('/', async (req, res) => {
  const trackName = req.body.track;

  try {
    if (!trackName) {
      console.error(`[error] trackName is undefined or null`.red);
      return res.status(400).json({ error: 'Track name is required' });
    }

    const tracks = await searchTracks(trackName);
    res.json({ tracks });
  } catch (e) {
    console.error(`[error] ${e}`.red);
    res.status(500).json({ error: e.message });
  }
});

app.get('/auth/twitch', (req, res) => {
  console.log('[info] Redirecting to Twitch...'.blue);
  res.redirect(TWITCH_URL);
});

app.get('/error', (req, res) => {
  const statusCode = req.query.status || 500;
  const statusMsg = req.query.message || 'Unknown error';

  res.status(statusCode).render('error', {
    statusCode,
    message: statusMsg,
  });
});

app.get('/auth/twitch/callback', async (req, res) => {
  try {
    const authCode = req.query.code;

    if (!authCode) {
      return res.status(400).render('error', {
        statusCode: 400,
        message: 'No authorization code provided',
      });
    }

    console.log('[info] Auth code received:'.green, authCode.substring(0, 10) + '...');

    try {
      const tokenResponse = await axios.post(
        'https://id.twitch.tv/oauth2/token',
        new URLSearchParams({
          client_id: TWITCH_ID,
          client_secret: TWITCH_SECRET,
          code: authCode,
          grant_type: 'authorization_code',
          redirect_uri: REDIRECT_URI,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const accessToken = tokenResponse.data.access_token;
      console.log('[info] Access token received'.green);

      const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Client-Id': TWITCH_ID,
        },
      });

      const userData = userResponse.data.data[0];
      console.log('[info] User data received:'.green, userData.login);

      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Authentication Successful</title>
          <style>
            body {
              font-family: 'Roboto', sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
            }
            .spinner {
              width: 50px;
              height: 50px;
              border: 5px solid rgba(255,255,255,0.3);
              border-top-color: white;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin: 20px auto;
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>✓ Welcome ${userData.display_name}!</h2>
            <div class="spinner"></div>
            <p>Closing window...</p>
          </div>
          <script>
            (function() {
              const userData = {
                username: '${userData.login}',
                displayName: '${userData.display_name}',
                profileImage: '${userData.profile_image_url}',
                id: '${userData.id}'
              };

              if (window.opener && !window.opener.closed) {
                window.opener.postMessage({
                  type: 'TWITCH_AUTH_SUCCESS',
                  user: userData
                }, window.location.origin);

                setTimeout(() => {
                  window.close();
                }, 1000);
              } else {
                document.querySelector('.container').innerHTML =
                  '<h2>✓ Authentication successful!</h2><p>You can close this window.</p>';
              }
            })();
          </script>
        </body>
        </html>
      `);
    } catch (apiError) {
      console.error('[error] Twitch API error:'.red, apiError.response?.data || apiError.message);
      return res.status(500).render('error', {
        statusCode: 500,
        message: 'Failed to authenticate with Twitch',
      });
    }
  } catch (e) {
    console.error(`[error] ${e}`.red);
    res.status(500).render('error', {
      statusCode: 500,
      message: e.message,
    });
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

app.use((req, res) => {
  res.status(404).render('404');
});

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

  console.log('');
  console.log('═══════════════════════════════════════'.cyan);
  console.log(`  🚀 Server running`.green);
  console.log(`  📍 Local:   http://localhost:${PORT}`.blue);
  if (HOST && !HOST.includes('localhost')) {
    console.log(`  🌍 Remote:  ${HOST}`.blue);
  }
  console.log(`  🔧 Mode:    ${NODE_ENV || 'development'}`.yellow);
  console.log('═══════════════════════════════════════'.cyan);
  console.log('');
});
