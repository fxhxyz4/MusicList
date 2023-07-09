import { refs } from './refs.js';

async function searchSpotify(trackName) {
  const res = await fetch('/', {
    method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        track: trackName,
      })
  })
    .then(r => r.json())
    .then(d => renderElements(d))
    .catch(e => console.error(e))
}

function renderElements(tracksObj) {
  const trackItems = tracksObj.tracks.items;

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

      /*
        *
        @fix
          img.onload = () => {
            if (licenseArray.includes(t.name)) {
              li.style.backgroundColor = `#fff`;
              img.style.opacity = `0`;

              a.style.opacity = `1`;
              a.textContent = `DMCA`;

              a.style.color = `red`;
              a.style.fontSize = `24px`;

              a.style.padding = `30px`;
              a.style.fontWeight = `500`;
            }
          };
      */


			img.src = t.album.images[1].url;
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
		});
}

export {searchSpotify, renderElements};
