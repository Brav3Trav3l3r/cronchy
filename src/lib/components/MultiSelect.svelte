<script>
	export let options;
	export let label;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	import { Check, ChevronDown, Verified, X } from 'lucide-svelte';
	import { quintOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	let selected = [];
	let show = false;
	let container;

	function onWindowClick(e) {
		if (container.contains(e.target) == false) {
			show = false;
		}
	}


</script>

<svelte:window on:click={onWindowClick} />

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="text-white text-sm">{label}</label>

<div bind:this={container} class="main relative">
	<div
		on:keydown
		on:click={() => (show = !show)}
		class="h-12 rounded-md bg-neutral flex items-center px-2"
	>
		{#if selected.length}
			<div class="flex items-center gap-2 justify-between w-full">
				<div class="main flex items-center gap-2">
					<h1 class="bg-base-content/10 p-1 px-2 rounded text-sm font-semibold line-clamp-1">
						{selected[0]}
					</h1>
					{#if selected.length > 1}
						<h1 class="bg-base-content/10 p-1 px-2 rounded text-sm font-semibold flex-1 shrink-0">
							{selected.length - 1} +
						</h1>
					{/if}
				</div>

				<button on:click={() => (selected = [])} class="icon hover:text-error pr-2">
					<X size="14" />
				</button>
			</div>
		{:else}
			<div class="placeholders px-2 flex justify-between items-center w-full">
				<h1 class="text-sm opacity-50">Any</h1>
				<div class="icon">
					<ChevronDown size="20" />
				</div>
			</div>
		{/if}
	</div>
	{#if show}
		

		<div
			transition:fly={{ y: 20, duration: 100, easing: quintOut }}
			class="absolute top-14 rounded-md inset-x-0 max-h-96 bg-neutral overflow-y-scroll scrollbar-hide p-2 z-50"
		>
			{#each options as item}
				<div
					on:keydown
					on:click={async () => {
						if (!selected.includes(item)) {
							selected = [...selected, item];
						} else {
							const newArr =  selected.filter((e) => e != item);
							selected = newArr;
						}

						dispatch("select",{
							data : selected
						})
					}}
					class="flex justify-between items-center w-full p-2 select-none hover:bg-primary/20 hover:text-primary rounded-md"
				>
					<h1 class="text-sm">
						{item}
					</h1>
					{#if selected.includes(item)}
						<div class="icon flex">
							<Check color="#e0aaff" size="20" />
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
