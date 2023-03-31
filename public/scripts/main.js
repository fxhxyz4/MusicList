console.clear();

import refs from './refs.js';

refs.formEl.addEventListener('submit', e => {
	e.preventDefault();
	refs.formEl.reset();
});

refs.loginBtn.addEventListener('click', () => {
	window.open('/auth/twitch');
});
