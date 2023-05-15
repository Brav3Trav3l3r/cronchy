<script>
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { error } from '@sveltejs/kit';
	import Card from '../Card.svelte';
	import { onDestroy, onMount } from 'svelte';
	export let anime;
	export let title;
	import { slide } from 'svelte/transition';
	import { ListPlus, Star } from 'lucide-svelte';
	import { MenuItem } from '@rgossiaux/svelte-headlessui';

	let maxLength = 350;
	afterNavigate(() => {
		maxLength = 350;
	});

	$: infoObj = [
		{
			name: 'Rating',
			value: anime?.rating / 10
		},
		{
			name: 'Type',
			value: anime?.type
		},
		{
			name: 'Total episodes',
			value: anime?.totalEpisodes
		},
		{
			name: 'Duration',
			value: anime?.duration
		},
		{
			name: 'Status',
			value: anime?.status
		},
		{
			name: 'Release Date',
			value: anime?.releaseDate
		},
		{
			name: 'Season',
			value: anime?.season
		},
		{
			name: 'Country of rigin',
			value: anime?.countryOfOrigin
		}
	];

	let time;

	function convertTimestamp(timestamp) {
		let d = new Date(timestamp * 1000), // Convert the passed timestamp to milliseconds
			yyyy = d.getFullYear(),
			mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
			dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
			hh = d.getHours(),
			h = hh,
			min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
			ampm = 'AM';

		if (hh > 12) {
			h = hh - 12;
			ampm = 'PM';
		} else if (hh === 12) {
			h = 12;
			ampm = 'PM';
		} else if (hh == 0) {
			h = 12;
		}

		// ie: 2014-03-24, 3:00 PM
		time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
	}

	$: convertTimestamp(anime?.nextAiringEpisode?.airingTime);

	let showMore = true;
	afterNavigate(() => [(showMore = false)]);
</script>

<div class="{showMore ? '' : 'h-48'} anime px-4 py-6 bg-neutral overflow-hidden relative">
	<div class="main-content flex flex-col xl:flex-row gap-8">
		<div class="poster w-fit">
			<div class="image aspect-[2/3 w-56 relative">
				<img src={anime?.image} alt={anime?.id} class="w-full h-full object-cover" />
				<div class="absolute top-2 right-2" />
			</div>
			<div
				class="bg-primary text-base-100 text-sm items-center justify-center w-full h-10 gap-2 flex"
			>
				<ListPlus size="20" />
				<h1 class="font-medium">Add to wathclist</h1>
			</div>

			<div class="mt-4 w-full py-3 space-y-4">
				{#each infoObj as item}
					<div class="type items-center">
						<h1 class="text-sm opacity-50">{item?.name}</h1>
						<h1 class="">{item?.value}</h1>
					</div>
				{/each}

				<div class="type items-center">
					<h1 class="text-sm opacity-50">Studios</h1>
					<div class="studios flex flex-col">
						{#if anime?.studios}
							{#each anime?.studios as studio}
								<h1 class="">{studio}</h1>
							{/each}
						{/if}
					</div>
				</div>
			</div>
		</div>
		<div class="g-2 space-y-16">
			<div class="one space-y-6">
				<div class="title">
					<h1 class="text-xl font-semibold max-w-prose">
						{anime?.title?.english ?? anime?.title?.romaji}
					</h1>
					<h1 class="max-w-prose opacity-60">{anime?.title?.romaji}</h1>
				</div>

				<div class="genres">
					<div class="info flex flex-wrap gap-x-3 gapy-2">
						{#if anime?.genres}
							{#each anime.genres as genre}
								<button class="badge badge-lg text-sm bg-info/10 border-info no-animation text-info"
									>{genre}</button
								>
							{/each}
						{/if}
					</div>
				</div>

				<div class="description space-y-2">
					<h1 class="font-medium text-lg">About</h1>
					<p class="max-w-prose text-sm opacity-70">{@html anime?.description}</p>
				</div>
			</div>

			<div class="trailer space-y-4">
				<h1 class="font-medium text-lg">Trailer</h1>
				<div class="video bg-black aspect-video max-h-80">
					<!-- <iframe
						allowfullscreen
						class="w-full h-full object-contain"
						{title}
						src="https://www.youtube.com/embed/{anime?.trailer?.id}"
					/> -->
				</div>
			</div>

			{#if anime?.relations?.length > 0}
				
				<div class=" space-y-4">
					<h1 class="font-medium text-lg">Relations</h1>
					<div class="flex flex-col gap-3">
						{#each anime.relations as anime}
							<a href="/{anime.id}?dub=false"
								><div class=" flex flex-row gap-4 md:gap-4 group">
									<div class="image h-32 aspect-[2/3]">
										<img
											src="https://proxy-for-movie-app.yashgajbhiye10.workers.dev/{anime?.image}"
											alt=""
											class="w-full h-full object-cover"
										/>
									</div>
									<div class="info w-1/2 flex-1 flex flex-col justify-between">
										<div class="g1 space-y-2">
											<h1 class="opacity-60 text-sm group-hover:opacity-80">
												{anime?.relationType}
											</h1>
											<h1
												class="line-clamp-2 text-sm font-medium opacity-80 group-hover:opacity-100"
											>
												{anime?.title?.english ?? anime?.title?.romaji}
											</h1>
											<h1 class="badge bg-info/10 border-info no-animation text-info">
												{anime?.type}
											</h1>
										</div>
									</div>
								</div></a
							>
						{/each}
					</div>
				</div>
			{/if}

			{#if anime?.recommendations?.length > 0}
				<div class="recommendations space-y-4">
					<h1 class="tfont-medium text-lg">Recommendations</h1>
					<div
						class="card-group grid gap-x-4 gap-y-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3"
					>
						{#each anime.recommendations as anime}
							{#if anime.id}
								<Card {anime} showRating="true" />
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div
		class="{showMore
			? 'hidden'
			: 'absolute'} inset-x-0 z-20 bottom-0 h-24 bg-gradient-to-t from-neutral to-transparent"
	/>
</div>
<div class="bg-neutral w-full h-8 flex justify-center">
	<button on:click={() => (showMore = !showMore)} class="btn btn-xs"
		>{showMore ? 'read less' : 'read more'}</button
	>
</div>
