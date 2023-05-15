<script>
	import { ChevronsUpDown, Grid, LayoutList, List, MoreHorizontal, Search } from 'lucide-svelte';

	import { page } from '$app/stores';

	import {
		Disclosure,
		DisclosureButton,
		DisclosurePanel,
		Tab,
		TabGroup,
		TabList,
		TabPanel,
		TabPanels
	} from '@rgossiaux/svelte-headlessui';

	import { afterNavigate, beforeNavigate } from '$app/navigation';

	export let anime;
	export let gogoAnime;
	export let animephaeAnime;

	import { slide } from 'svelte/transition';

	import { currentEp, currentProvider, storeViewType } from '$lib/stores/playerStore.js';
	import { onMount } from 'svelte';

	$: selected = $currentProvider.id;

	let loading = false;

	$: sources = [animephaeAnime, anime, gogoAnime];

	let providers = [
		{ id: 0, name: 'Animephae', value: 'animephae', color: '#D5005A' },
		{ id: 1, name: 'Zoro', value: 'zoro', color: '#CFD660' },
		{ id: 2, name: 'Gogoanime', value: 'gogoanime', color: '#FFC119' }
	];

	const assignEpisodes = () => {
		if ($currentProvider?.id === 0) {
			currentEp.set(animephaeAnime?.episodes[0]);
		} else if ($currentProvider?.id === 1) {
			currentEp.set(anime?.episodes[0]);
		} else if ($currentProvider?.id === 2) {
			currentEp.set(gogoAnime?.episodes[0]);
		}
	};

	onMount(() => {
		assignEpisodes();
	});

	afterNavigate(() => {
		assignEpisodes();
	});

	$: viewType = $storeViewType;

</script>

<div class="episodes px-2 space-y-6">
	<TabGroup
		bind:defaultIndex={selected}
		on:change={(e) => {
			selected = e.detail;
			currentProvider.set(providers.find((e) => e.id === selected));
		}}
		class="relative space-y-4"
	>
		<TabList class="tabs relative w-full space-x-3 wrap-0 z-20">
			{#each providers as provider}
				<Tab
					let:selected
					class={selected === provider.id
						? `bg-accent text-base-200 font-semibold hover:bg-accent-focus rounded-md tab`
						: 'tab bg-neutral rounded-md'}>{provider.name}</Tab
				>
			{/each}
		</TabList>

		<div class="relative z-20 w-full flex justify-between items-center gap-4">
			<!-- <input
				type="text"
				placeholder="Jump to"
				class="input bg-base-content text-base-100 placeholder-base-100 rounded-md input-bordered w-full max-w-xs"
			/> -->

			<div class="relative flex-1 max-w-48">
				<input type="text" placeholder="Search episode" class="input bg-neutral placeholder:text-sm placeholder:text-base-content placeholder:opacity-50 w-full" />

				<!-- <span
					class="pointer-events-none absolute inset-y-0 end-0 grid w-10 place-content-center text-gray-500 dark:text-gray-400"
				>
					<Search size="20" />
				</span> -->
			</div>
			<div class="layout-view flex gap-3">
				<div
					on:keydown
					on:click={() => storeViewType.set(0)}
					class="{viewType === 0 ? 'text-accent' : 'opacity-50'} "
				>
					<LayoutList size="20" />
				</div>
				<div
					on:keydown
					on:click={() => storeViewType.set(1)}
					class="{viewType === 1 ? 'text-accent' : 'opacity-50'} "
				>
					<List size="20" />
				</div>
				<div
					on:keydown
					on:click={() => storeViewType.set(2)}
					class="{viewType === 2 ? 'text-accent' : 'opacity-50'} "
				>
					<Grid size="20" />
				</div>
			</div>
		</div>

		<!-- <div
			class="absolute pointer-events-none top-20 inset-x-0 h-16 z-10 bg-gradient-to-b from-base-100 to-transparent"
		/> -->
		<TabPanels class="max-h-[800px] relative scrollbar-hide overflow-y-auto pb-10">
			{#each sources as source}
				{#if viewType === 0}
					<TabPanel class=" space-y-2 first:pt-2">
						{#each source?.episodes as ep, i}
							<Disclosure
								on:keydown
								on:click={() => currentEp.set(ep)}
								let:open
								class="last:pb-4 group"
							>
								<div
									class="{$currentEp?.id === ep?.id
										? 'text-info bg-neutral p-2 '
										: ''}  flex flex-row gap-3 hover:bg-neutral md:gap-4 p-2"
								>
									<div class="image h-24 aspect-video">
										<img
											src="https://proxy-for-movie-app.yashgajbhiye10.workers.dev/{ep?.image}"
											alt=""
											class="w-full h-full object-cover"
										/>
									</div>
									<div class="info w-1/2 flex-1 flex flex-col justify-between">
										<div class="g1 py-2 space-y-1">
											<h1 class="opacity-60 text-xs"># Episode {ep.number}</h1>
											<h1 class="{$currentEp?.id === ep?.id ? "opacity-100" : " opacity-80" } line-clamp-2 text-sm group-hover:opacity-100">
												{ep?.title ?? anime?.episodes[i]?.title ?? ""}
											</h1>
										</div>
										<!-- <DisclosureButton class={`${open ? '' : ' '} bg-neutral p-1  w-fit ml-auto`}>
											<ChevronsUpDown size="16" />
										</DisclosureButton> -->
									</div>
								</div>

								{#if open}
									<div in:slide={{ duration: 200 }} out:slide={{ duration: 100 }}>
										<DisclosurePanel static class="description p-4 bg-neutral my-2 rounded-md ">
											<p class="text-sm opacity-70">{ep?.description}</p>
										</DisclosurePanel>
									</div>
								{/if}
							</Disclosure>
						{/each}
					</TabPanel>
				{:else if viewType === 1}
					<TabPanel class="space-y-2 first:pt-2">
						{#each source.episodes as ep, i}
							<div
								class="{$currentEp?.id === ep?.id
									? 'text-info bg-neutral px-2 '
									: ''} flex flex-row gap-2 px-2 hover:bg-neutral"
							>
								<div on:keydown on:click={() => currentEp.set(ep)} class="g1 space-y-1 flex-1 py-2">
									<h1 class="opacity-60 text-xs"># Episode {ep?.number}</h1>
									<h1 class="line-clamp-2 text-sm {$currentEp?.id === ep?.id ? "opacity-100" : " opacity-80" } hover:opacity-100">{ep?.title ?? anime?.episodes[i]?.title ?? ""}</h1>
								</div>
							</div>
						{/each}
					</TabPanel>
				{:else if viewType === 2}
					<TabPanel class="space-y-4 pt-2">
						<div class="grid grid-cols-8 gap-3">
							{#if source?.episodes}
								{#each source.episodes as ep}
									<div
										on:keydown
										on:click={() => currentEp.set(ep)}
										class="{$currentEp?.id === ep?.id
											? 'text-info border-none bg-neutral'
											: 'border-base-content/20'} border font-semibold hover:border-primary p-2 text-center duration-200 cursor-pointer"
									>
										<h1 class="">{ep?.number}</h1>
									</div>
								{/each}
							{/if}
						</div>
					</TabPanel>
				{/if}
			{/each}
		</TabPanels>
		<div
			class="absolute pointer-events-none bottom-0 inset-x-0 h-16 z-10 bg-gradient-to-t from-base-100 to-transparent"
		/>
	</TabGroup>
</div>
