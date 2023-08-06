import { refs } from './refs.js';

async function handleCallback() {
  const popup = window.open('/auth/twitch');

  const message = await new Promise((resolve) => {
    const handleResponse = (e) => {
      if (e.origin === window.location.origin) {
        const data = e.data;
        console.log(data);

        if (data.login === true) {
          refs.loginBtn.textContent = `Logout`;
        } else {
          console.error(`error`);
        }

        popup.close();
        window.removeEventListener('message', handleResponse);
        resolve(e);
      }
    };

    window.addEventListener('message', handleResponse);
  });

  const { data } = message;

  if (data.login === true) {
    refs.loginBtn.textContent = `Logout`;
  } else {
    console.error(`error`);
  }

  popup.close();
}

export { handleCallback };
