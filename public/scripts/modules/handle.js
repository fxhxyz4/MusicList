import { refs } from './refs.js';

function handleCallback() {
  const popup = window.open('/auth/twitch', "Twitch Auth", "width=600,height=600");

  window.addEventListener('message', handleResponse);

  function handleResponse(e) {
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
    }
  }
}

export { handleCallback };
