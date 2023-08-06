console.clear();

import { refs } from './modules/refs.js';
import { searchSpotify } from './modules/fetch.js';
import { handleCallback } from './modules/handle.js';

refs.formEl.addEventListener('submit', e => {
	e.preventDefault();

	const value = refs.inputEl.value.trim();

	localStorage.setItem('_input', value);
	const inputStorage = localStorage.getItem('_input');

	if (!value) {
		refs.inputEl.placeholder = `[error]`;
		console.error(`[error]`);
	} else {
		searchSpotify(value);

    refs.spinEl.classList.remove('visually-hidden');
		refs.inputEl.placeholder = `Type to search...`;
	}

	refs.formEl.reset();
});

refs.loginBtn.addEventListener('click', handleCallback);
