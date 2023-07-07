<script>
	import Artplayer from 'artplayer';
	import { onDestroy, onMount } from 'svelte';
	import { currentEp, currentProvider, continueWatching } from '$lib/stores/playerStore.js';
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';

	// let proxy = 'https://m3u8proxy.yashgajbhiye10.workers.dev/?url=';
	// let proxy = 'https://m3u8-proxy-cors-eta.vercel.app/cors?url=';
	let proxy = 'https://proxy.vnxservers.com/proxy/m3u8/';

	$: arr = $continueWatching;
	export let anime;
	let currentTime = 0;

	$: playingEpisode = {
		id: anime?.id.toString(),
		title: anime?.title?.english ?? anime?.title?.romaji,
		image: anime?.image,
		rating: anime?.rating,
		totalEpisodes: anime?.totalEpisodes,
		eps: [
			{
				number: $currentEp?.number,
				title: $currentEp?.title,
				image: $currentEp?.image,
				time: currentTime,
				duration: duration,
				percent: ((currentTime - 1) / duration) * 100
			}
		],
		lastWatched: {
			percent: (currentTime / duration) * 100,
			number: $currentEp?.number
		}
	};

	export let malId;
	let duration;
	let openingTime;
	let endingTime;
	let captionArray;
	let art;
	let url = null;
	let ready = false;

	const getSkipTime = async () => {
		try {
			const res = await fetch(
				`https://api.aniskip.com/v2/skip-times/${malId}/${$currentEp?.number}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=${duration}`
			);
			const resJson = await res.json();
			if (resJson.found) {
				const array = resJson.results.map(({ skipType, interval }) => ({ skipType, interval }));
				const openingTimeObj = array.find((e) => e.skipType === 'op');
				const endingTimeObj = array.find((e) => e.skipType === 'ed');

				openingTime = openingTimeObj?.interval?.startTime;
				endingTime = openingTimeObj?.interval?.endTime;
			} else {
				console.log('skipTime not found');
			}
		} catch (error) {
			console.error(error);
		}
	};

	function playM3u8(video, url, art) {
		if (Hls.isSupported()) {
			if (art.hls) art.hls.destroy();
			const hls = new Hls();
			hls.loadSource(url);
			hls.attachMedia(video);
			art.hls = hls;
			art.on('destroy', () => hls.destroy());
		} else if (video.canPlayType('application/vnd.apple.mpegurl')) {
			video.src = url;
		} else {
			art.notice.show = 'Unsupported playback format: m3u8';
		}
	}

	$: if ($currentEp?.id) {
		streamEpisode($currentEp?.id);
	}

	const getDefaultSource = (sources) => {
		let defaultSource;
		try {
			defaultSource = sources.find(
				(source) => source.quality === 'auto' || source.quality === 'default'
			);
		} catch (error) {
			// throw new Error('no sources found');
			alert('No sources found. Change provider')
		}
		return defaultSource.url || sources[0].url;
	};

	const streamEpisode = async (id) => {
		let response;
		try {
			response = await fetch(
				`https://api.consumet.org/meta/anilist/watch/${id}?provider=${$currentProvider.value}`
			);
		} catch (error) {
			console.error(error);
			currentProvider.set('gogoanime');
		}
		const streamingSrc = await response.json();
		url = await getDefaultSource(streamingSrc.sources);
		art.url = `${proxy}${encodeURIComponent(url)}`;

		// if ($currentProvider.value === 'zoro') {
		// 	const subArray = streamingSrc?.subtitles;
		// 	captionArray = subArray.map((obj) => createNewObjectWithChangedKeys(obj, keyMap));
		// }
	};

	const keyMap = {
		lang: 'html',
		url: 'url'
	};

	const createNewObjectWithChangedKeys = (obj, keyMap) => {
		const newObj = {};
		for (const key in obj) {
			if (keyMap.hasOwnProperty(key)) {
				if (key === 'lang') {
					newObj[keyMap[key]] = `<span style="">${obj[key]}</span>`;
				} else {
					newObj[keyMap[key]] = obj[key];
				}
			} else {
				newObj[key] = obj[key];
			}
		}
		return newObj;
	};

	onMount(() => {
		art = new Artplayer({
			container: '.artplayer-app',
			type: 'm3u8',
			fullscreen: true,
			screenshot: true,
			customType: {
				m3u8: playM3u8
			},
			setting: true,
			subtitle: {
				type: 'srt',
				encoding: 'utf-8',
				escape: false,
				style: {
					color: '#fff',
					'font-size': '1.5rem'
				}
			},
			plugins: [
				artplayerPluginHlsQuality({
					// Show quality in setting
					setting: true,

					// Get the resolution text from level
					getResolution: (level) => level.height + 'P',

					// I18n
					title: 'Quality',
					auto: 'Auto'
				})
			],
			layers: [
				{
					name: 'button',
					html: '<button type="button">Click me !!</button>',
					style: {
						display: 'none',
						position: 'absolute',
						right: '20px',
						top: '20px',
						backgroundColor: 'red',
						padding: '2px'
					},
					click() {
						art.seek = 10;
					},
					mounted(button) {
						this.on('video:timeupdate', () => {
							if (this?.currentTime > 5 && this?.currentTime < 10) {
								button.style.display = 'block';
							} else {
								button.style.display = 'none';
							}
						});
					}
				}
			]
		});

		// art.on('ready', () => {
		// 	console.info('ready');
		// });

		art.on('video:timeupdate', () => {
			currentTime = Math.trunc(art?.currentTime);
		});

		art.on('video:loadeddata', async (e) => {
			duration = await e.target.duration;
			await findAndSeek();

			await getSkipTime();

			art.layers.update({
				name: 'button',
				html: '<button type="button" class="skip-button"><span>Skip!!</span></button>',
				style: {
					display: 'none',
					position: 'absolute',
					right: '20px',
					top: '20px',
					backgroundColor: 'white',
					padding: '3px',
					color: 'black'
				},
				click() {
					art.seek = endingTime;
				},
				mounted(button) {
					this.on('video:timeupdate', () => {
						if (this?.currentTime > openingTime && this?.currentTime < endingTime) {
							button.style.display = 'block';
						} else {
							button.style.display = 'none';
						}
					});
				}
			});
			// art.controls.add(
			// 	{
			// 		html: 'Subtitle',
			// 		name: 'subtitle',
			// 		position: 'right',
			// 		selector: captionArray,
			// 		onSelect: async function (item, $dom, event) {
			// 			art.subtitle.url = item.url;
			// 			// return item.html;
			// 		}
			// 	}
			// )
		});
	});

	// afterNavigate(() => {
	// });

	onDestroy(() => {
		updateContinueWatching();
	});

	const findAndSeek = async () => {
		const anime = await arr.find((obj) => obj['id'] === $page.params.id.toString());
		if (anime) {
			const ep = anime.eps.find((e) => e?.number === $currentEp?.number);
			if (ep) {
				console.log('found time');
				art.seek = ep.time;
			}
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
</script>

<div bind:this={art} class="artplayer-app w-full h-full object-contain" />
