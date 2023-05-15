<script>
	import Artplayer from 'artplayer';
	import { onDestroy, onMount } from 'svelte';
	import { currentEp, currentProvider, continueWatching } from '$lib/stores/playerStore.js';

	let proxy = 'https://m3u8proxy.yashgajbhiye10.workers.dev/?url=';

	export let malId;
	let duration;
	let openingTime;
	let endingTime;

	const getSkipTime = async () => {
		console.log('hi');
		const res = await fetch(
			`https://api.aniskip.com/v2/skip-times/${malId}/${$currentEp?.number}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=${duration}`
		);
		const resJson = await res.json();
		const array = resJson.results.map(({ skipType, interval }) => ({ skipType, interval }));
		openingTime = array.find((e) => e.skipType === 'op');
		endingTime = array.find((e) => e.skipType === 'ed');

		console.log('openingTime', openingTime?.interval?.startTime);
		console.log('endTime', endingTime);
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

	let art;
	let url = null;
	let i = 0;
	$: console.log(i);

	let ready = false;

	$: if ($currentEp) {
		console.log('ran');
		streamEpisode($currentEp.id);
	}

	const getDefaultSource = (sources) => {
		i = i + 1;
		console.log('sources:', sources);
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
		url = await getDefaultSource(streamingSrc.sources);
		if ($currentProvider.value === 'zoro') {
			art.url = url;
		} else {
			art.url = `${proxy}${encodeURIComponent(url)}`;
		}
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
			// icons: {
			// 	loading: '<img src="/assets/img/ploading.gif">',
			// 	state: '<img width="150" heigth="150" src="/assets/img/state.svg">',
			// 	indicator: '<img width="16" heigth="16" src="/assets/img/indicator.svg">'
			// },
			// layers: [
			// 	{
			// 		name: 'button',
			// 		html: '<button type="button">Click me !!</button>',
			// 		style: {
			// 			display: 'none',
			// 			position: 'absolute',
			// 			right: '20px',
			// 			top: '20px',
			// 			backgroundColor: 'red',
			// 			padding: '2px'
			// 		},
			// 		click() {
			// 			art.seek = openingTime?.interval?.endTime;
			// 		},
			// 		mounted(button) {
			// 			this.on('video:timeupdate', () => {
			// 				if (this.currentTime > 5 && this.currentTime < 10) {
			// 					button.style.display = 'block';
			// 				} else {
			// 					button.style.display = 'none';
			// 				}
			// 			});
			// 		}
			// 	}
			// ]
		});

		art.on('ready', () => (ready = true));
		art.on('video:loadeddata', async (e) => {
			duration = await e?.target?.duration;
			if ($currentEp?.number != '1') {
				await getSkipTime();
			}
			art.layers.add({
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
					art.seek = openingTime?.interval?.endTime;
				},
				mounted(button) {
					this.on('video:timeupdate', () => {
						if (this.currentTime > openingTime?.interval?.startTime && this.currentTime < 10) {
							button.style.display = 'block';
						} else {
							button.style.display = 'none';
						}
					});
				}
			});
		});
	});

	// onDestroy (()=>[
	// 	art.destroy()
	// ])
</script>

<!-- <svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
	<script
		src="https://cdn.jsdelivr.net/npm/artplayer-plugin-hls-quality/dist/artplayer-plugin-hls-quality.js"
	></script>
</svelte:head> -->

<div class="artplayer-app w-full h-full object-contain" />
