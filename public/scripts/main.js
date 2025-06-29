import { searchSpotify, renderElements } from './modules/fetch.js';
import { handleCallback } from './modules/handle.js';
import { handleText } from './modules/handleText.js';
import { loadFromDB } from './modules/db.js';
import { refs } from './modules/refs.js';

const saved = loadFromDB();

if (saved.length > 0) {
  renderElements({ tracks: { items: saved } });
}

refs.formEl.addEventListener('submit', async e => {
  e.preventDefault();
  const value = refs.inputEl.value.trim();

  if (!value) {
    refs.inputEl.placeholder = `[error]`;
    console.error(`[error]`);
    return;
  }

  refs.spinBackEl.classList.remove('visually-hidden');
  refs.spinEl.classList.remove('visually-hidden');

  refs.inputEl.placeholder = `Type to search...`;

  try {
    localStorage.clear();
    await searchSpotify(value);
  } catch (e) {
    console.error('Search error:', e);
  } finally {
    refs.spinBackEl.classList.add('visually-hidden');
    refs.spinEl.classList.add('visually-hidden');
  }

  refs.formEl.reset();
});

refs.loginBtn.addEventListener('click', handleCallback);

window.addEventListener('load', handleText);
window.addEventListener('resize', handleText);
