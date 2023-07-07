<script>
	import {
		continueWatching,
		currentProvider,
		isDub,
		currentEp,
		currentEpNumber
	} from '$lib/stores/playerStore.js';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css';
</script>

<div class="continue-watching">
	{#if $continueWatching.length > 0}
		<div class="continue-watching space-y-6">
			<h1 class="text-2xl font-semibold">Continue watching</h1>
			<!-- <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 gap-y-4"> -->
			<Splide
				options={{
					// rewind: true,
					perPage: 5,
					breakpoints: {
						640: {
							perPage: 2
						},
						1280: {
							perPage: 3
						}
						// 1280: {
						// 	perPage:4
						// }
					},
					gap: '1rem'
				}}
				aria-label="My Favorite Images"
			>
				{#each $continueWatching as anime}
					<SplideSlide>
						<a href="/{anime.id}?dub=false">
							<div
								on:keydown
								on:click={() => {
									currentEpNumber.set(anime?.eps[0].number);
								}}
								class="mian flex flex-col gap-3"
							>
								<a href="/{anime.id}?dub={$isDub}&provider={$currentProvider.value}"
									><div class="card aspect-video relative">
										<img
											class="w-full h-full object-cover"
											src="{anime.eps[0]
												.image}"
											alt=""
										/>
										<div class="absolute flex items-end bg-base-100/50 p-3 inset-0">
											<i class="text-sm font-semibold"
												>{anime.eps[0].number}. {anime.eps[0].title}</i
											>
										</div>
										<div class="percent layer absolute inset-0 flex items-end">
											<div
												style="width: {anime.eps[0].percent}%;"
												class="transparent absolute z-10 inset-y-0 border-b-4 border-accent"
											/>
											<div
												style="width: {anime.eps[0].percent}%;"
												class="transparent blur absolute z-10 inset-y-0 border-b-4 border-accent"
											/>
										</div>
									</div></a
								>
								<h1 class="line-clamp-2 opacity-80 font-semibold group-hover:opacity-100">
									{anime.title}
								</h1>
							</div></a
						>
					</SplideSlide>
				{/each}
			</Splide>
			<!-- </div> -->
		</div>
	{/if}
</div>
