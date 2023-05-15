/** @type {import('./$types').PageLoad} */
export async function load({ params, url }) {
	console.log(params)

    const data = async () => {
		const res = await fetch(
			`https://proxy-for-movie-app.yashgajbhiye10.workers.dev/https://api-consumet-rust.vercel.app/meta/anilist/${params.category}?perPage=21`
		);
		if (res.ok) {
			return await res.json();
		}
	};

    return {
        data : data(),
        title : params.category
    }
}