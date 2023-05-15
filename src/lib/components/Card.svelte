<script>
	export let anime;
	$: title = anime.title?.english ?? anime.title.romaji;
	import { Percent, Star } from 'lucide-svelte';

</script>

<!-- <h1>{anime.id}</h1> -->

<a href="/{anime.id}?dub=false"
	><div class="card space-y-2 group">
		<div class="image relative aspect-[2/3] truncate shadow-xl">
			<img src={anime.image} alt="" class="brightness-90 h-full w-full object-cover" />
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
			<h1 class="line-clamp-2 opacity-80 text-sm font-semibold group-hover:opacity-100">{title}</h1>
			<div class="opacity-50 group-hover:opacity-70 text-sm flex gap-2 items-center">
				<h1>{anime?.totalEpisodes ?? anime?.episodeNumber ?? anime?.episodes ?? '0'} eps</h1>
				<h1>•</h1>
				<h1>{anime?.type}</h1>
			</div>
		</div>
	</div>
</a>
