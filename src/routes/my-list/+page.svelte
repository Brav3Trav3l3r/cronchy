<script>
    import {myList} from '../../lib/stores/playerStore'
    import Card from '../../lib/components/Card.svelte';

</script>

<div class=" px-4 md:px-6 lg:px-16 mt-28 gap-6 space-y-8 ">
	<h1 class="font-medium text-lg">My list</h1>
	<div
		class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-3 sm:gap-x-4 gap-y-10"
	>
		{#each $myList as anime}
			{#if anime.id}
				<Card {anime} showRating="true" />
			{/if}
		{/each}
	</div>
</div>
