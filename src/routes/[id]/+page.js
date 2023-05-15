/** @type {import('./$types').PageLoad} */
export async function load({ params, url }) {
	const dub = await url.searchParams.get('dub');

	let title;

	const zoro = async () => {
		const res = await fetch(
			`https://proxy-for-movie-app.yashgajbhiye10.workers.dev/https://api-consumet-rust.vercel.app/meta/anilist/info/${params.id}?dub=${dub}&provider=zoro`
		);
		if (res.ok) {
			return await res.json();
		}
	};
	const gogoanime = async () => {
		const res = await fetch(
			`https://proxy-for-movie-app.yashgajbhiye10.workers.dev/https://api-consumet-rust.vercel.app/meta/anilist/info/${params.id}?dub=${dub}&provider=gogoanime`
		);
		if (res.ok) {
			return await res.json();
		}
	};
	const animephae = async () => {
		const res = await fetch(
			`https://proxy-for-movie-app.yashgajbhiye10.workers.dev/https://api-consumet-rust.vercel.app/meta/anilist/info/${params.id}?dub=${dub}&provider=animephae`
		);
		if (res.ok) {
			return await res.json();
		}
	};

	return {
		zoro: zoro(),
		gogoanime: gogoanime(),
		animephae: animephae()
	};
}
