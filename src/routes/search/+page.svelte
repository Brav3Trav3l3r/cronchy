<script>
	import { Filter, FilterX } from 'lucide-svelte';
	import MultiSelect from '../../lib/components/MultiSelect.svelte';
	import Select from '../../lib/components/Select.svelte';
	import Card from '../../lib/components/Card.svelte';
	import { get } from 'svelte/store';

	$: year = newObj[0]?.year;
	$: season = newObj[1]?.season;
	$: format = newObj[2]?.format;
	$: status = newObj[3]?.status;
	$: genres = newObj[4]?.genres;
	$: query = newObj[5]?.query;

	const createUrl = async () => {
		let url = '?';

		if (query) {
			url += `query=${query}&`;
		}
		if (genres.length) {
			const param1String = `[${genres.map((value) => `"${value}"`).join(',')}]`;
			url += `genres=${param1String}&`;
		}
		if (year) {
			url += `year=${year}&`;
		}
		if (season) {
			url += `season=${season}&`;
		}
		if (format) {
			url += `format=${format}&`;
		}
		if (status) {
			url += `status=${status}&`;
		}

		url = url.slice(0, -1);
		return url;
	};

	let results = [];

	const getData = async () => {
		const newUrl = await createUrl();
		console.log(newUrl);
		const res = await fetch(`https://api.consumet.org/meta/anilist/advanced-search` + newUrl);
		const data = await res.json();
		results = data.results;
	};

	$: if (newObj) {
		getData();
	}

	const genresOptions = [
		'Action',
		'Adventure',
		'Cars',
		'Comedy',
		'Drama',
		'Fantasy',
		'Horror',
		'Mahou Shoujo',
		'Mecha',
		'Music',
		'Mystery',
		'Psychological',
		'Romance',
		'Sci-Fi',
		'Slice of Life',
		'Sports',
		'Supernatural',
		'Thriller'
	];

	let yearOptions = [];

	for (let i = 1940; i <= 2023; i++) {
		yearOptions.unshift(i.toString());
	}

	const seasonOptions = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];

	const formatOptions = ['TV', 'TV_SHORT', 'OVA', 'ONA', 'MOVIE', 'SPECIAL', 'MUSIC'];

	const statusOptions = ['RELEASING', 'NOT_YET_RELEASED', 'FINISHED', 'CANCELLED', 'HIATUS'];

	let showOptions = false;

	$: obj = [
		{
			id: 0,
			label: 'Year',
			option: yearOptions,
			query: { year: '' }
		},
		{
			id: 1,
			label: 'Season',
			option: seasonOptions,
			query: { season: '' }
		},
		{
			id: 2,
			label: 'Format',
			option: formatOptions,
			query: { format: '' }
		},
		{
			id: 3,
			label: 'Airirng Status',
			option: statusOptions,
			query: { status: '' }
		}
	];

	$: newObj = [...obj.map((e) => e.query), { genres: genresList }, { query: queryString }];

	let queryString = '';
	$: console.log(query);

	$: genresList = [];
</script>

<div class="px-4 md:px-6 lg:px-16 mt-28 gap-6 space-y-16">
	<div class="flex flex-col xl:flex-row gap-x-4 gap-y-8">
		<div class="flex gap-4">
			<div class="search min-w-48 flex flex-col flex-1 gap-2">
				<label for="search" class="text-white text-sm">Search</label>
				<input
					bind:value={queryString}
					id="search"
					type="text"
					placeholder="Search"
					class="input bg-neutral placeholder:text-sm placeholder:text-base-content placeholder:opacity-50"
				/>
			</div>
			<div on:keydown class="flex lg:hidden mt-auto">
				<label class="btn btn-circle rounded-md swap">
					<input type="checkbox" on:click={(e) => (showOptions = e.target.checked)} />

					<div class="icon swap-off fill-current">
						<Filter />
					</div>
					<div class="icon swap-on fill-current">
						<FilterX />
					</div>
				</label>
			</div>
		</div>

		<div
			class="fiter-group lg:flex flex-1 gap-4 {showOptions
				? 'grid grid-cols-2 sm:grid-cols-3'
				: 'hidden'} overscroll-x-auto"
		>
			<div class="genres flex-1 flex flex-col gap-2">
				<MultiSelect
					options={genresOptions}
					label={'Genres'}
					on:select={async (e) => {
						genresList = e.detail.data;
					}}
				/>
			</div>
			{#each obj as item (item.id)}
				<div class="search flex flex-col flex-1 gap-2">
					<Select
						options={item.option}
						label={item.label}
						on:select={async (e) => {
							const keyName = Object.keys(item?.query)[0];
							item.query[keyName] = e.detail?.data;
						}}
					/>
				</div>
			{/each}
		</div>
	</div>

	<div class="history space-y-8">
		<div class="gap-3 items-center flex">
			<h1 class="text-xl font-medium">Recommended to you</h1>
			<div class="icon text-3xl flex">
				<iconify-icon icon="streamline-emojis:sparkles" />
			</div>
		</div>

		{#if results?.length}
			<div
				class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-3 sm:gap-x-4 gap-y-10"
			>
				{#each results as anime}
					<Card {anime} />
				{/each}
			</div>
		{/if}
	</div>
</div>
