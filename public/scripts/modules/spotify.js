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
		const r = await fetch(`https://api.spotify.com/v1/search?type=track&q=${query}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const data = await r.json();
		const result = refs.listEl;

		result.innerHTML = '';

		data.tracks.items.forEach(t => {
			const li = document.createElement('li'),
				img = document.createElement('img'),
				a = document.createElement('a');

			img.src = t.album.images[2].url;
			img.alt = t.album.name;
			a.href = t.external_urls.spotify;
			a.innerText = `${t.name} by ${t.artists[0].name}`;

			li.appendChild(img);
			li.appendChild(a);
			result.appendChild(li);
		});
	} catch (e) {
		console.error(e);
	}
}
