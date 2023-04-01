console.clear();

import throttle from 'lodash.throttle';
import refs from './modules/refs.js';
import input from './modules/input.js';

const THROTTLE_MS = 90;

console.log(SPOTIFY_SECRET, SPOTIFY_ID);

refs.inputEl.addEventListener('input', throttle(input, THROTTLE_MS));

refs.formEl.addEventListener('submit', e => {
	e.preventDefault();

	refs.formEl.reset();
});

refs.loginBtn.addEventListener('click', () => {
	window.open('/auth/twitch');
});
