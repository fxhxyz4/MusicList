console.clear();

import refs from './modules/refs.js';
import { searchSpotify } from './modules/spotify.js';

refs.formEl.addEventListener('submit', e => {
	e.preventDefault();

	const value = refs.inputEl.value;
	searchSpotify(value);

	refs.formEl.reset();
});

refs.loginBtn.addEventListener('click', () => {
	window.open('/auth/twitch');
});
