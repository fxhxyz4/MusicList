import refs from './modules/refs.js';

refs.formEl.addEventListener('submit', e => {
	e.preventDefault();

	refs.formEl.reset();
});