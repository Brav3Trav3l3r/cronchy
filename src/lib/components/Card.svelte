<script>
	export let anime;
	$: title = anime.title?.english ?? anime.title.romaji ?? anime.title;
	import { Percent, Star, Heart } from 'lucide-svelte';
	import { myList, isDub } from '$lib/stores/playerStore.js';
	import { invalidate } from '$app/navigation';

	const addToLib = (id) => {
		let newArr = [
			{
				id: id.toString(),
				image: anime.image,
				rating: anime.rating,
				totalEpisodes: anime.totalEpisodes,
				title: anime.title?.english ?? anime.title?.romaji ?? anime.title,
				type: anime.type
			},
			...$myList
		];

		console.log(newArr);

		myList.set(newArr);

		invalidate();
	};

	const deleteFromLib = async (id) => {
		const newArr = await $myList.filter((m) => m?.id != anime.id);
		myList.set(newArr);
	};

	$: allIds = $myList.map((e) => e.id);
	$: console.log(allIds);
</script>

<!-- <h1>{anime.id}</h1> -->

<div class="card space-y-2 group">
	<div class="image relative aspect-[2/3] truncate shadow-xl">
		<div class="absolute group-hover:flex flex-col gap-2 right-1 top-1 z-10 hidden">
			{#if allIds.includes(anime.id.toString())}
				<button
					on:click={() => deleteFromLib(anime.id)}
					class="w-8 aspect-square bg-red-300 flex items-center justify-center rounded-full"
					><Heart fill="red" strokeWidth="0" size="20" /></button
				>
			{:else}
				<button
					on:click={() => addToLib(anime.id.toString())}
					class=" w-8 aspect-square bg-red-300 flex items-center justify-center rounded-full"
					><Heart color="red" size="20" /></button
				>
			{/if}
			<!-- {#if newArr.includes(anime.id.toString())}
					<div class="tooltip tooltip-right tooltip-primary" data-tip="Remove">
						<button
							on:click={() => removeFromContinuetWatching(anime)}
							class="w-8 aspect-square bg-secondary text-base-100 hover:text-red-500 flex items-center justify-center rounded-full"
							><X strokeWidth="2" size="20" /></button
						>
					</div>
				{/if} -->
		</div>
		<a href="/{anime.id}?dub={$isDub}"
			><img src={anime.image} alt="" class="brightness-90 h-full w-full object-cover" /></a
		>
		<div
			class="absolute bottom-2 right-2 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]"
		>
			<div class="bg-neutral drop-shadow-2xl px-3 py-1 flex items-center gap-2">
				<h1 class="text-sm">{anime.rating / 10}</h1>
				<div class="logo text-accent">
					<Star size="16" fill="#fab818" strokeWidth="0" />
				</div>
			</div>
		</div>
	</div>
	<div class="info space-y-1">
		<h1 class="line-clamp-2 opacity-80 font-semibold group-hover:opacity-100">{title}</h1>
		<div class="opacity-50 group-hover:opacity-70 text-sm flex gap-2 items-center">
			<h1>{anime?.totalEpisodes ?? anime?.episodeNumber ?? anime?.episodes ?? '0'} eps</h1>
			<h1>•</h1>
			<h1>{anime?.type}</h1>
		</div>
	</div>
</div>
