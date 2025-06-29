import { addToDB } from './db.js';
import { refs } from './refs.js';

async function searchSpotify(trackName) {
  const res = await fetch('/', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      track: trackName,
    }),
  })
    .then(r => r.json())
    .then(d => renderElements(d))
    .catch(e => console.error(e));
}

function renderElements(tracksObj) {
  if (tracksObj !== null) {
    refs.spinEl.classList.add('visually-hidden');
  }

  const trackItems =
    tracksObj?.tracks?.items || tracksObj?.items || tracksObj?.tracks || [];

  let resultEl = refs.listEl;
  resultEl.innerHTML = '';

  trackItems.forEach((t, i) => {
    const li = document.createElement('li'),
      span = document.createElement('span'),
      img = document.createElement('img'),
      a = document.createElement('a');

    span.classList.add('main__span');
    li.classList.add('main__item');

    img.classList.add('main__img');
    a.classList.add('main__link');

    img.src = t.album.images[1]?.url || t.album.images[0]?.url || '';
    img.alt = t.album.name;

    a.href = t.external_urls.spotify;
    a.target = '_blank';
    a.rel = 'noopener noreferrer nofollow';

    a.textContent = `${t.name} - ${t.artists[0].name}`;
    span.textContent = `click`;

    resultEl.appendChild(li);
    a.appendChild(span);

    li.appendChild(img);
    li.appendChild(a);

    addToDB(t);
  });
}

export { searchSpotify, renderElements };
