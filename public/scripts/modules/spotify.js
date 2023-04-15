import refs from './refs.js';
import config from '../config/config.js';
import license from '../../../data.json';

const client_id = config.client_id;
const client_secret = config.client_secret;
const token_endpoint = 'https://accounts.spotify.com/api/token';
const licenseArray = license.data;

const authString = `${client_id}:${client_secret}`;
const encodedAuthString = btoa(authString);

const response = await fetch(token_endpoint, {
	method: 'POST',
	headers: {
		Authorization: `Basic ${encodedAuthString}`,
		'Content-Type': 'application/x-www-form-urlencoded',
	},
	body: 'grant_type=client_credentials',
});

const data = await response.json();
const token = data.access_token;

export async function searchSpotify(query) {
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
