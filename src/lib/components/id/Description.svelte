<script>
	import { currentEp } from '$lib/stores/playerStore.js';
	import { ListPlus, MessagesSquare, MoreHorizontal, Share } from 'lucide-svelte';

	export let anime;
</script>

<main>
	<div class="contain py-4 flex items-center justify-between w-full gap-3">
		<div class="title space-y-1 flex flex-col justify-center">
			<h1 class="font-medium text-white text-lg line-clamp-1">{$currentEp?.number}. {$currentEp?.title ?? anime?.title?.english ?? anime?.title?.romaji }</h1>
			<div class="anime-title flex gap-8 items-center">
				<h1 class="text-sm">{anime?.title?.english ?? anime?.title?.romaji }</h1>
			</div>
		</div>

		<div class="interactive  gap-4 h-full mt-auto flex-end flex justify-between items-center ">
			

			<div class="icons flex gap-4">
				<div class="button btn bg-base-content text-base-100 btn-sm w-fit flex gap-2">
					<ListPlus size="20" />
					<h1 class="text-xs hidden md:block">Add to wathclist</h1>
				</div>
				<button
					class="btn btn-sm font-semibold bg-base-content/10 hover:bg-base-content/5 w-fit flex item-center
             gap-2"
				>
					<Share size="16" />
					<h1 class="text-xs hidden md:block">Share</h1>
				</button>

				<button
					class="btn btn-sm font-semibold bg-base-content/10 hover:bg-base-content/5 aspect-square"
				>
					<div class="icon">
						<MessagesSquare size="20" />
					</div>
				</button>
				<button
					class="btn btn-sm font-semibold bg-base-content/10 hover:bg-base-content/5 aspect-square"
				>
					<div class="icon">
						<MoreHorizontal size="20" />
					</div>
				</button>
			</div>
		</div>
	</div>
</main>
