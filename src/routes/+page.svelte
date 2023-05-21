<script>
	import Featured from '$lib/components/Featured.svelte';
	export let data;
	$: trend = data.trend?.results ?? undefined;
	$: recent = data.recent?.results ?? undefined;
	$: popular = data.popular?.results;
	import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@rgossiaux/svelte-headlessui';
	import Card from '../lib/components/Card.svelte';
	import { Splide, SplideSlide, SplideTrack } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css';
	import { Plus } from 'lucide-svelte';

	import { onDestroy } from 'svelte';
	import ContinueWatching from '../lib/components/ContinueWatching.svelte';

	let selected = 0;

	let loading = false;

	let currentPageTrend = 1;
	let currentPageRecent = 1;
	let currentPagePopular = 1;

	const getTrending = async () => {
		loading = true;
		currentPageTrend += 1;
		const response = await fetch(
			`https://proxy-for-movie-app.yashgajbhiye10.workers.dev/https://api-consumet-rust.vercel.app/meta/anilist/trending?perPage=18&page=${currentPageTrend}`
		);
		const resJson = await response.json();
		trend = [...trend, ...resJson.results];
		loading = false;
	};
	const getRecent = async () => {
		loading = true;
		currentPageRecent += 1;
		const response = await fetch(
			`https://proxy-for-movie-app.yashgajbhiye10.workers.dev/https://api-consumet-rust.vercel.app/meta/anilist/recent-episodes?perPage=18&page=${currentPageRecent}`
		);
		const resJson = await response.json();
		recent = [...recent, ...resJson.results];
		loading = false;
	};
	const getPopular = async () => {
		loading = true;
		currentPagePopular += 1;
		const response = await fetch(
			`https://proxy-for-movie-app.yashgajbhiye10.workers.dev/https://api-consumet-rust.vercel.app/meta/anilist/popular?perPage=18&page=${currentPagePopular}`
		);
		const resJson = await response.json();
		popular = [...popular, ...resJson.results];
		loading = false;
	};

	onDestroy(() => {
		currentPageTrend = 1;
		currentPageRecent = 1;
		currentPagePopular = 1;
		loading = false;
	});

	// let categories = ["Trending", "Recent releases", "Popular"]
	$: categories = [
		{
			id: 0,
			name: 'Trending',
			anchor: 'trending',
			value: trend,
			icon: 'streamline-emojis:fire'
		},
		{
			id: 1,
			name: 'Recent episodes',
			anchor: 'recent-episodes',
			value: recent,
			icon: 'streamline-emojis:seedling'
		},
		{
			id: 2,
			name: 'Popular',
			anchor: 'popular',
			value: popular,
			icon: 'streamline-emojis:rocket'
		}
	];
</script>

<div class="main space-y-6">
	<Featured />
	<div class="main flex mt-12 px-4 md:px-6 lg:px-16 space-y-16 flex-col">
		<!-- <TabGroup
			on:change={(e) => (selected = e.detail)}
			class="main mx-4 md:mx-6  pb-10 rounded-md  space-y-8"
		>
			<TabList class="tabs space-x-3 w-fit wrap-0">
				{#each categories as category}
					<Tab
						let:selected
						class={selected === category.id
							? 'bg-base-content text-base-200 font-semibold hover:bg-base-content/90 rounded-full tab'
							: 'tab bg-neutral rounded-full'}>{category.name}</Tab
					>
				{/each}
			</TabList>

			<TabPanels class="">
				<TabPanel class="main flex flex-col items-center gap-20">
					<div
						class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 md:gap-x-6 gap-y-8"
					>
						{#each trend as anime}
							<Card {anime} />
						{/each}
					</div>
					<button
						on:click={async () => {
							getTrending();
						}}
						class="btn bg-gradient-to-r from-primary to-secondary rounded-none text-base-100 flex gap-1"
					>
						{#if loading}
							<h1>Loading</h1>
							<div class="icon text-3xl h-fit flex items-center">
								<iconify-icon icon="eos-icons:three-dots-loading" />
							</div>
						{:else}
							<h1 class="">Load more</h1>
							<div class="icon flex align-middle">
								<Plus size="14" />
							</div>
						{/if}
					</button>
				</TabPanel>
				<TabPanel class="main flex flex-col items-center gap-8"
					><div
						class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 md:gap-x-6 gap-y-8"
					>
						{#each recent as anime}
							<Card {anime} />
						{/each}
					</div>
					<button
						on:click={async () => {
							getRecent();
						}}
						class="btn bg-gradient-to-r from-primary to-secondary rounded-none text-base-100 flex gap-1"
					>
						{#if loading}
							<h1>Loading</h1>
							<div class="icon text-3xl h-fit flex items-center">
								<iconify-icon icon="eos-icons:three-dots-loading" />
							</div>
						{:else}
							<h1 class="">Load more</h1>
							<div class="icon flex align-middle">
								<Plus size="14" />
							</div>
						{/if}
					</button>
				</TabPanel>
				<TabPanel class="main flex flex-col items-center gap-8"
					><div
						class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 md:gap-x-6 gap-y-8"
					>
						{#each popular as anime}
							<Card {anime} />
						{/each}
					</div>
					<button
						on:click={async () => {
							getPopular();
						}}
						class="btn bg-gradient-to-r from-primary rounded-none to-secondary text-base-100 flex gap-1"
					>
						{#if loading}
							<h1>Loading</h1>
							<div class="icon text-3xl h-fit flex items-center">
								<iconify-icon icon="eos-icons:three-dots-loading" />
							</div>
						{:else}
							<h1 class="">Load more</h1>
							<div class="icon flex align-middle">
								<Plus size="14" />
							</div>
						{/if}
					</button></TabPanel
				>
			</TabPanels>
		</TabGroup> -->
		<ContinueWatching />

		{#each categories as item}
			<div class="trend space-y-8">
				<div class="heading flex justify-between items-center">
					<div class="gap-3 items-center flex">
						<h1 class="text-2xl font-semibold">{item?.name}</h1>
						<div class="icon text-3xl flex">
							<iconify-icon icon={item?.icon} />
						</div>
					</div>
					<a href="/anime/{item.anchor}"><h1 class="opacity-80">View all</h1></a>
				</div>
				<div
					class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-3 sm:gap-x-4 gap-y-10"
				>
					{#if item?.value}
						{#each item?.value as anime}
							<Card {anime} />
						{/each}
					{/if}
				</div>
			</div>
		{/each}
	</div>
</div>
