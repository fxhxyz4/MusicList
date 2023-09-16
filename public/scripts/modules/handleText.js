import { refs } from './refs.js';

function handleText() {
  const bool = localStorage.getItem('_login');
  let btnTxt = '';

  if (window.innerWidth <= 100) {
    btnTxt = '';
  } else if (window.innerWidth <= 800) {
    btnTxt = '';
  } else if (bool === 'true') {
    btnTxt = 'Logged';
  } else if (window.innerWidth <= 1400) {
    btnTxt = 'Login';
  } else {
    btnTxt = 'Login with Twitch';
  }

  refs.loginTxt.textContent = btnTxt;
}

export { handleText };
