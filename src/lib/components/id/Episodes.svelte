<script>
	import {
		ChevronsUpDown,
		Grid,
		LayoutList,
		List,
		MoreHorizontal,
		Search,
		Subtitles,
		Mic
	} from 'lucide-svelte';

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

	import { afterNavigate, beforeNavigate, goto, invalidateAll } from '$app/navigation';

	export let anime;
	export let animephaeAnime;

	const noEpsAlert = () => {
		if (anime?.episodes.length === 0 || animephaeAnime?.episodes.length === 0) {
			console.log('No episodes available. Try switching audio');
		}
	};

	noEpsAlert();

	import {
		currentEp,
		currentEpNumber,
		currentProvider,
		storeViewType,
		isDub
	} from '$lib/stores/playerStore.js';
	import { onDestroy, onMount } from 'svelte';

	$: selected = $currentProvider.id;

	let loading = false;

	$: sources = [animephaeAnime, anime];

	let providers = [
		{ id: 0, name: 'Animephae', value: 'animephae', color: '#D5005A' },
		{ id: 1, name: 'Gogoanime', value: 'gogoanime', color: '#FFC119' }
	];

	const assignEpisodes = async () => {
		if ($currentProvider?.id === 0) {
			if ($currentEpNumber) {
				const ep = await animephaeAnime?.episodes?.find((e) => e?.number === $currentEpNumber);
				currentEp.set(ep);
			} else {
				currentEp.set(animephaeAnime?.episodes[0]);
			}
		} else if ($currentProvider?.id === 1) {
			if ($currentEpNumber) {
				const ep = await anime?.episodes?.find(
					(e) => e.number.toString() === $currentEpNumber.toString()
				);
				currentEp.set(ep);
			} else {
				currentEp.set(anime?.episodes[0]);
			}
		}
	};

	afterNavigate(() => {
		assignEpisodes();
	});

	onDestroy(() => {
		currentEpNumber.set(null);
	});

	let value;

	$: viewType = $storeViewType;
</script>

<div class="episodes">
	<TabGroup
		bind:defaultIndex={selected}
		on:change={(e) => {
			selected = e.detail;
			currentProvider.set(providers.find((e) => e.id === selected));
		}}
		class=""
	>
		<div class="first relative space-y-6 pb-6 p-3 lg:p-0 lg:pb-6">
			<div class="g1 flex justify-between items-center">
				<TabList class="tabs relative w-full space-x-3 wrap-0 z-20">
					{#each providers as provider}
						<Tab
							let:selected
							class={selected === provider?.id
								? `bg-white text-base-100 font-medium rounded-md tab`
								: 'tab bg-neutral text-base-content rounded-md font-medium'}>{provider?.name}</Tab
						>
					{/each}
				</TabList>

				<div class="tooltip" data-tip="Switch audio">
					<input
						type="checkbox"
						class="toggle"
						checked={$isDub}
						on:change={(e) => {
							isDub.set(e.target.checked);
							goto(`/${anime.id}?dub=${$isDub}`);
						}}
					/>
				</div>
			</div>

			<div class="relative z-20 w-full flex justify-between items-center gap-4">
				<div class="relative flex-1 max-w-48">
					<input
						bind:value
						type="text"
						placeholder="Search episode"
						class="input bg-neutral placeholder:text-sm placeholder:text-base-content placeholder:opacity-50 w-full"
					/>
				</div>
				<div class="layout-view flex gap-3">
					<div
						on:keydown
						on:click={() => storeViewType.set(0)}
						class="{viewType === 0 ? 'text-white' : 'opacity-50'} "
					>
						<LayoutList size="20" />
					</div>
					<div
						on:keydown
						on:click={() => storeViewType.set(1)}
						class="{viewType === 1 ? 'text-white' : 'opacity-50'} "
					>
						<List size="20" />
					</div>
					<div
						on:keydown
						on:click={() => storeViewType.set(2)}
						class="{viewType === 2 ? 'text-white' : 'opacity-50'} "
					>
						<Grid size="20" />
					</div>
				</div>
			</div>

			<div class="flex items-center gap-2 relative">
				<hr class="flex-1 opacity-10" />
				<h1 class="text-sm opacity-70 font-semibold">EPISODES</h1>
				<hr class="flex-1 opacity-10" />
			</div>
		</div>

		<TabPanels class="max-h-[800px] relative scrollbar-hide overflow-y-auto">
			<!-- <div
				class="sticky z-50 pointer-events-none top-0 left-0 right-0 h-8 bg-gradient-to-b from-base-100 to-transparent"
			/> -->
			{#each sources as source}
				{#if viewType === 0 && source?.episodes}
					<TabPanel class="last:pb-8 grid grid-cols-1 gap-2">
						{#if source?.episodes?.length}
							{#each source?.episodes as ep, i}
								<div
									id="{i}-{ep.title}"
									on:keydown
									on:click={() => currentEp.set(ep)}
									let:open
									class="group"
								>
									<div
										class="{$currentEp?.id === ep?.id
											? 'text-primary bg-primary/10'
											: 'text-white '} flex flex-row gap-3 hover:bg-neutral md:gap-4 p-2"
									>
										<div class="image h-24 aspect-video">
											<img src={ep?.image} alt="" class="w-full h-full object-cover" />
										</div>
										<div class="info w-1/2 flex-1 flex flex-col justify-between">
											<div class="g1 space-y-1">
												<h1
													class="{$currentEp?.id === ep?.id
														? ''
														: 'opacity-70'} line-clamp-2 group-hover:opacity-100"
												>
													{ep?.title ?? anime?.episodes[i]?.title ?? ''}
												</h1>
												<h1 class="opacity-60 text-xs">Episode {ep.number}</h1>
											</div>
										</div>
									</div>
								</div>
							{/each}
						{:else}
							<h1>No episodes. Switch audio or change provider</h1>
						{/if}
					</TabPanel>
				{:else if viewType === 1}
					<TabPanel class="space-y-2">
						{#if source?.episodes?.length}
							{#each source?.episodes as ep, i}
								<div
									class="{$currentEp?.id === ep?.id
										? 'text-primary bg-primary/10'
										: 'text-white'} flex flex-row gap-2 px-2 hover:bg-neutral"
								>
									<div
										on:keydown
										on:click={() => currentEp.set(ep)}
										class="g1 space-y-1 flex-1 py-2"
									>
										<h1
											class="line-clamp-2 {$currentEp?.id === ep?.id
												? ''
												: ' opacity-70'} hover:opacity-100"
										>
											{ep?.title ?? anime?.episodes[i]?.title ?? ''}
										</h1>
										<h1 class="opacity-60 text-xs"># Episode {ep?.number}</h1>
									</div>
								</div>
							{/each}
						{:else}
							<h1>No episodes. Switch audio or change provider</h1>
						{/if}
					</TabPanel>
				{/if}
			{/each}
		</TabPanels>
		<div
			class="absolute pointer-events-none bottom-0 inset-x-0 h-16 z-10 bg-gradient-to-t from-base-100 to-transparent"
		/>
	</TabGroup>
</div>
