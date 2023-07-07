/** @type {import('./$types').PageLoad} */
export async function load({ params, url }) {

    const data = async () => {
		const res = await fetch(
			`https://api-consumet-rust.vercel.app/meta/anilist/${params.category}?perPage=21`
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