<script>
	import Artplayer from 'artplayer';
	import { onDestroy, onMount } from 'svelte';
	import { currentEp, currentProvider, continueWatching } from '$lib/stores/playerStore.js';

	// let proxy = 'https://m3u8proxy.yashgajbhiye10.workers.dev/?url=';
	// let proxy = 'https://m3u8-proxy-cors-eta.vercel.app/cors?url=';
	let proxy = 'https://proxy.vnxservers.com/proxy/m3u8/';

	export let malId;
	let duration;
	let openingTime;
	let endingTime;
	let captionArray;

	$: console.log(openingTime);
	$: console.log(endingTime);

	const getSkipTime = async () => {
		console.log('hi');
		const res = await fetch(
			`https://api.aniskip.com/v2/skip-times/${malId}/${$currentEp?.number}?types[]=ed&types[]=mixed-ed&types[]=mixed-op&types[]=op&types[]=recap&episodeLength=${duration}`
		);
		const resJson = await res.json();
		const array = resJson.results.map(({ skipType, interval }) => ({ skipType, interval }));
		const openingTimeObj = array.find((e) => e.skipType === 'op');
		const endingTimeObj = array.find((e) => e.skipType === 'ed');

		openingTime = openingTimeObj?.interval?.startTime;
		endingTime = openingTimeObj?.interval?.endTime;
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

	let ready = false;

	$: if ($currentEp) {
		streamEpisode($currentEp.id);
	}

	const getDefaultSource = (sources) => {
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
							if (this.currentTime > 5 && this.currentTime < 10) {
								button.style.display = 'block';
							} else {
								button.style.display = 'none';
							}
						});
					}
				}
			]
		});

		art.on('video:loadeddata', async (e) => {
			duration = await e.target.duration;

			await getSkipTime();

			art.layers.update({
				name: 'button',
				html: '<button type="button" class="skip-button"><span>Click me !!</span></button>',
				style: {
						display: 'none',
						position: 'absolute',
						right: '20px',
						top: '20px',
						backgroundColor: 'red',
						padding: '2px'
					},
				click() {
					art.seek = endingTime;
				},
				mounted(button) {
					this.on('video:timeupdate', () => {
						if (this.currentTime > openingTime && this.currentTime < endingTime) {
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

	onDestroy(() => {
		art.destroy();
	});
</script>

<div bind:this={art} class="artplayer-app w-full h-full object-contain" />

<style>
	/* .art-player-button {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.skip-button {
		display: block;
		position: absolute;
		right: 20px;
		top: 20px;
		width: 200px;
		height: 40px;
		line-height: 40px;
		font-size: 18px;
		font-family: sans-serif;
		text-decoration: none;
		color: #333;
		border: 2px solid #333;
		letter-spacing: 2px;
		text-align: center;
		position: relative;
		transition: all 0.35s;
	}

	.skip-button span {
		position: relative;
		z-index: 2;
	}

	.skip-button:after {
		position: absolute;
		content: '';
		top: 0;
		left: 0;
		width: 0;
		height: 100%;
		background: #ff003b;
		transition: all 0.35s;
	}

	.skip-button:hover {
		color: #fff;
	}

	.skip-button:hover:after {
		width: 100%;
	} */

	/* .artplayer-app button{
		display: none;
		position: absolute;
		bottom: 80px;
		left: 20px;
	} */


</style>
