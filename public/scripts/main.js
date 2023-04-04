console.clear();

import throttle from 'lodash.throttle';
import refs from './modules/refs.js';
import input from './modules/input.js';

const THROTTLE_MS = 90;
const TIMEOUT_MS = 3000;

refs.inputEl.addEventListener('input', throttle(input, THROTTLE_MS));

refs.formEl.addEventListener('submit', e => {
	e.preventDefault();

	refs.formEl.reset();
});

refs.loginBtn.addEventListener('click', () => {
	window.open('/auth/twitch');

	twitchLogin();
});

function twitchLogin() {
	document.addEventListener('click', e => {
		if (e.target.classList.contains('.nav-auth__link')) {
			refs.loginBtn.textContent = `Logout`;
			window.open('/');
		}

		const timeout = setTimeout(() => {
			window.open('/');
		}, TIMEOUT_MS * 1000);
	});
}
