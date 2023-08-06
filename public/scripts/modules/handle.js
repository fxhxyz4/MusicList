import { refs } from './refs.js';

function handleCallback() {
  window.open('/auth/twitch');

  fetch('/auth/twitch/callback')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    if (data.login === true) {
      refs.loginBtn.textContent = `Logout`;
    } else {
      console.error(`error`);
    }
  })
  .catch(e => {
    console.error(`Error on authorization: ${e.message}`);
  });
}

export { handleCallback };
