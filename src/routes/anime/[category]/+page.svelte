<script>
	export let data;
	import Card from '../../../lib/components/Card.svelte';
	import { Plus } from 'lucide-svelte';

	$: list = data.data.results;
	$: title = data.title;

	let loading = false;

	let currentPage = 1;

	let category = [
		{
			title: 'Trending Anime',
			id: 'trending'
		},
		{
			title: 'Recent episodes',
			id: 'recent-episodes'
		},
		{
			title: 'Popular Anime',
			id: 'popular'
		}
	];

	const expandList = async () => {
		const response = await fetch(
			`https://api-consumet-rust.vercel.app/meta/anilist/${title}?perPage=14&page=${currentPage}`
		);
		const resJson = await response.json();
		list = [...list, ...resJson.results];
	};
</script>

<div class="px-4 md:px-6 lg:px-16 mt-28 gap-6 space-y-8">
	<h1 class="text-2xl font-medium">{(category?.find((e) => e.id == title)).title}</h1>
	<div
		class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-3 sm:gap-x-4 gap-y-10"
	>
		{#each list as anime}
			<Card {anime} />
		{/each}
	</div>
	<button
		on:click={async () => {
			loading = true;
			currentPage += 1;
			await expandList();
			loading = false;
		}}
		class="btn btn-primary rounded-none flex gap-1 mx-auto"
	>
		<h1 class="">Load more</h1>
		{#if loading}
			<div class="icon text-3xl h-fit flex items-center">
				<iconify-icon icon="eos-icons:three-dots-loading" />
			</div>
		{:else}
			<div class="icon flex align-middle">
				<Plus size="14" />
			</div>
		{/if}
	</button>
</div>
