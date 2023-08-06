import { refs } from './refs.js';

async function handleCallback() {
  const popup = window.open('/auth/twitch');


  try {
    const response = await fetch('/auth/twitch/callback', {
      method: 'GET',
    });

    if (!response.ok) {
      console.error('server err');
    } else {
      const loginData = await response.json();
      console.log(loginData);
    }
  } catch (e) {
    console.error(`fetch err: ${e}`);
  }
}

export { handleCallback };
