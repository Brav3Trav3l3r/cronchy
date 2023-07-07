<script>
	import { onDestroy, onMount } from 'svelte';
	import { defineCustomElements } from 'vidstack/elements';
	import 'vidstack/styles/defaults.css';
	import { currentEp, currentProvider, continueWatching } from '$lib/stores/playerStore.js';
	import { afterNavigate } from '$app/navigation';
	import 'media-captions/styles/captions.css';

	import { page } from '$app/stores';

	let arr = $continueWatching;

	let vidoeDuration;


	$: playingEpisode = {
		id: $page?.params?.id.toString(),
		title: $page?.data?.animephae?.title?.english ?? $page?.data?.animephae?.title?.romaji,
		image: $page?.data?.animephae?.image,
		rating: $page?.data?.animephae?.rating,
		totalEpisodes: $page?.data?.animephae?.totalEpisodes,
		eps: [
			{
				number: $currentEp?.number,
				title: $currentEp?.title,
				image: $currentEp?.image,
				time: playerCurrentTime,
				duration: vidoeDuration,
				percent: (playerCurrentTime / vidoeDuration) * 100
			}
		],
		lastWatched: {
			percent: (playerCurrentTime / vidoeDuration) * 100,
			number: $currentEp?.number
		}
	};

	const updateContinueWatching = async () => {
		const foundIndex = await arr.findIndex((obj) => obj['id'] === $page.params.id);
		if (foundIndex !== -1) {
			const obj = arr[foundIndex].eps.find((obj) => obj['number'] === playingEpisode.eps[0].number);
			if (obj) {
				obj.time = playingEpisode.eps[0].time;
			} else if (playingEpisode.eps[0].time > 20) {
				arr[foundIndex].eps.unshift(playingEpisode.eps[0]);
			}
			if (playingEpisode.eps[0].time > 20) {
				arr[foundIndex].lastWatched = playingEpisode.lastWatched;
			}
		} else if (playingEpisode.eps[0].time > 20) {
			arr.unshift(playingEpisode);
		}
		continueWatching.set(arr);
	};

	let player;
	let captions = [];

	let playerCurrentTime;

	// let proxy = 'https://m3u8-proxy-cors-eta.vercel.app/cors?url=';
	let proxy = "https://proxy.vnxservers.com/proxy/m3u8/"

	const getDefaultSource = (sources) => {
		const defaultSource = sources.find(
			(source) => source.quality === 'auto' || source.quality === 'default'
		);
		
		return defaultSource.url || sources[0].url;
	};

	const streamEpisode = async (id) => {
		const response = await fetch(
			`https://api-consumet-rust.vercel.app/meta/anilist/watch/${id}?provider=${$currentProvider.value}`
		);
		const streamingSrc = await response.json();
		const url = await getDefaultSource(streamingSrc.sources);
		if ($currentProvider.value === 'zoro') {
			captions = streamingSrc?.subtitles;
		}
		player.src = `${proxy}${url}`;
		// player.src =  `${proxy}${encodeURIComponent(getDefaultSource(streamingSrc.sources))}`;
	};

	$: if ($currentEp) {
	}

	onMount(async () => {
		let unsub;
		let unsubPaused;
		defineCustomElements().then(() => {
			player.onAttach(() => {
				streamEpisode($currentEp?.id);
				unsub = player.subscribe(({ currentTime }) => {
					playerCurrentTime = Math.trunc(currentTime);
				});

				unsubPaused = player.subscribe(({ duration }) => {
					vidoeDuration = Math.trunc(duration);
				});
			});
		});

		return {
			unsub,
			unsubPaused
		};
	});

	// player.addEventListener('source-change', () => {
	// 	updateContinueWatching();
	// });

	afterNavigate(() => {
		currentEp.set(null);
		art.destroy()
	});

	onDestroy(async () => {
		await updateContinueWatching();
		currentEp.set(null);
	});
</script>

<media-player
	controls
	aspect-ratio="16/9"
	bind:this={player}
	poster="{$currentEp?.image}"
	class="w-full h-full object-contain"
>
	<media-outlet />
</media-player>
