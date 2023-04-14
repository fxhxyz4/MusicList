import refs from './refs.js';

export async function searchSpotify(query) {
	const token = '74e32fcef00f4917950e482de83f327d';

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
			const li = document.createElement('li');
			const img = document.createElement('img');
			const a = document.createElement('a');

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
