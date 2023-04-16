import refs from './refs.js';
import license from '../../../data/data.json';

const SPOTIFY_ID = process.env.SPOTIFY_ID;
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;

const token_uri = 'https://accounts.spotify.com/api/token';
const licenseArray = license.data;

const authParams = `${SPOTIFY_ID}:${SPOTIFY_SECRET}`;
const encodedString = btoa(authParams);

let count = 1;

export async function searchSpotify(query) {
	const res = await fetch(token_uri, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${encodedString}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: 'grant_type=client_credentials',
	});

	const d = await res.json();
	const token = d.access_token;

	try {
		const r = await fetch(`https://api.spotify.com/v1/search?type=track&q=${query}&limit=15`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const data = await r.json();
		console.log(data);

		let resultEl = refs.listEl;
		resultEl.innerHTML = '';

		data.tracks.items.forEach(t => {
			const li = document.createElement('li'),
				span = document.createElement('span'),
				img = document.createElement('img'),
				a = document.createElement('a');

			span.classList.add('main__span');
			li.classList.add('main__item');

			img.classList.add('main__img');
			a.classList.add('main__link');

			// love js

			const key = count;
			const value = JSON.stringify({
				name: t.name,
				artist: t.artists[0].name,
				url: t.external_urls.spotify,
			});

			JSON.stringify(localStorage.setItem(key, value));
			count++;

			const local = JSON.parse(localStorage.getItem(count));
			// console.log(local);
			// resultEl = local;

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

		if (count === 15) {
			localStorage.clear();
		}

		count = 1;
	} catch (e) {
		console.error(e);
	}
}
