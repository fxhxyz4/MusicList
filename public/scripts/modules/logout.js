import { refs } from './refs.js';

function logout() {
  const bool = localStorage.getItem('_login');

  if (bool === true) {
    console.log(1);
  }
}

export { logout };
