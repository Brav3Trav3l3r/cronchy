<script>
	import { currentEp } from '$lib/stores/playerStore.js';
	import { ListPlus, MessagesSquare, MoreHorizontal, Share } from 'lucide-svelte';

	export let anime;
</script>

<main>
	<div class="contain py-4 flex flex-col gap-3">
		<div class="title space-y-1 flex flex-col justify-center">
			<h1>{$currentEp?.number}. {$currentEp?.title}</h1>
		</div>

		<div class="interactive gap-4 h-full mt-auto flex-end flex justify-between items-center flex-1">
			<div class="anime-title flex gap-8 items-center">
				<h1 class="opacity-60">{anime?.title?.english ?? anime?.title?.romaji}</h1>
				<div class="button btn text-base-100 font-semibold btn-primary btn-sm w-fit flex gap-2">
					<ListPlus size="20" />
					<h1 class="text-xs hidden md:block">Add to wathclist</h1>
				</div>
			</div>

			<div class="icons flex gap-4">
				<button
					class="btn btn-sm font-semibold bg-base-content/10 hover:bg-base-content/5 w-fit flex item-center
             gap-2"
				>
					<Share size="16" />
					<h1 class="text-xs hidden md:block">Share</h1>
				</button>

				<button class="btn btn-sm font-semibold bg-base-content/10 hover:bg-base-content/5 aspect-square">
					<div class="icon">
						<MessagesSquare size="20" />
					</div>
				</button>
				<button class="btn btn-sm font-semibold bg-base-content/10 hover:bg-base-content/5 aspect-square">
					<div class="icon">
						<MoreHorizontal size="20" />
					</div>
				</button>
			</div>
		</div>
	</div>
</main>
