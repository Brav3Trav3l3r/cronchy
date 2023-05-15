export async function load() {
	const trend = async () => {
		console.log('trend:', Date.now());
		const res = await fetch(
			'https://api-consumet-rust.vercel.app/meta/anilist/trending?perPage=7'
		);
		if (res.ok) {
			return await res.json();
		}
	};
	const recent = async () => {
		console.log('recen:', Date.now());
		const res = await fetch(
			'https://api-consumet-rust.vercel.app/meta/anilist/recent-episodes?perPage=7'
		);
		if (res.ok) {
			return await res.json();
		}
	};
	const popular = async () => {
		console.log('pop: ', Date.now());
		const res = await fetch(
			'https://api-consumet-rust.vercel.app/meta/anilist/popular?perPage=7'
		);
		if (res.ok) {
			return await res.json();
		}
	};

	return {
		trend: trend(),
		recent: recent(),
		popular: popular()
	};
}
