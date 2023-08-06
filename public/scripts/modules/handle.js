import { refs } from './refs.js';

async function handleCallback() {
  const popup = window.open('/auth/twitch');

  const message = await new Promise((resolve) => {
    window.addEventListener('message', resolve);
  });

  const { data } = message;

  if (data.login === true) {
    refs.loginBtn.textContent = `Logout`;
  } else {
    console.error(`error`);
  }

  popup.close();
  window.removeEventListener('message', handleResponse);
}

export { handleCallback };
