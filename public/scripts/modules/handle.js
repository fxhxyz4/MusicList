import { handleText } from './handleText.js';

function handleCallback() {
  const popup = window.open('/auth/twitch');

  const interval = setInterval(() => {
    if (popup.closed) {
      clearInterval(interval);
    } else {
      try {
        if (popup.location.href.includes('/auth/twitch/callback')) {
          const url = new URL(popup.location.href);
          const authCode = url.searchParams.get('code');

          popup.close();
          fetchData(authCode);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, 1e3);
}

async function fetchData(authCode) {
  try {
    const res = await fetch(`/auth/twitch/callback?code=${authCode}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });

    const { login, code } = await res.json();

    if (login) {
      localStorage.setItem('_code', code);
      localStorage.setItem('_login', login);

      handleText();
    }
  } catch (e) {
    console.error(e);
  }
}


export { handleCallback };
