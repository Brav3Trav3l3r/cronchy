<script>
	export let data;
    import Card from '../../../lib/components/Card.svelte';

    $:list = data.data
	$: title = data.title;

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
</script>

<div class="px-4 md:px-6 lg:px-16 mt-28 gap-6 space-y-8">
	<h1 class="text-2xl font-medium">{(category?.find((e) => e.id == title)).title}</h1>
	<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-3 sm:gap-x-4 gap-y-10">
		{#each list.results as anime}
			<Card {anime} />
		{/each}
	</div>
</div>
