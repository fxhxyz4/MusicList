console.clear();

import refs from './modules/refs.js';
import { searchSpotify } from './modules/spotify.js';

refs.formEl.addEventListener('submit', e => {
	e.preventDefault();

	const value = refs.inputEl.value.trim();
	console.log(value);

	if (value === '' || null) {
		refs.inputEl.placeholder = `[error]`;
		console.error(`[error]`);
	} else {
		searchSpotify(value);
		refs.inputEl.placeholder = `Type to search...`;
	}

	refs.formEl.reset();
});

refs.loginBtn.addEventListener('click', () => {
	window.open('/auth/twitch');
});
