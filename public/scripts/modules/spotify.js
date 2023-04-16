import refs from './refs.js';
import license from '../../../data/data.json';

const SPOTIFY_ID = process.env.SPOTIFY_ID;
const SPOTIFY_SECRET = process.env.SPOTIFY_SECRET;

const token_uri = 'https://accounts.spotify.com/api/token';
const licenseArray = license.data;

const authParams = `${SPOTIFY_ID}:${SPOTIFY_SECRET}`;
const encodedString = btoa(authParams);

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

			img.src = t.album.images[1].url;
			img.alt = t.album.name;

			a.href = t.external_urls.spotify;
			a.target = '_blank';
			a.rel = 'noopener noreferrer nofollow';

			a.textContent = `${t.name} - ${t.artists[0].name}`;
			span.textContent = `click`;

			const searchResult = {
				imageSrc: t.album.images[1].url,
				imageAlt: t.album.name,
				url: t.external_urls.spotify,
			};

			let results = localStorage.getItem('searchRes');
			results = results ? JSON.parse(results) : [];

			results.push(searchResult);
			localStorage.setItem('searchRes', JSON.stringify(results));

			resultEl.appendChild(li);
			a.appendChild(span);

			li.appendChild(img);
			li.appendChild(a);
		});
	} catch (e) {
		console.error(e);
	}
}
