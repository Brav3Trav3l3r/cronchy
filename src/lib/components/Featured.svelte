<script>
	import { Play, ListVideo, Share } from 'lucide-svelte';
	import '@splidejs/svelte-splide/css';
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';


	let collections=[{
		logo: "https://animeanime.global/wp-content/uploads/2021/07/416960.jpg",
		cover: "https://kayoanime.com/wp-content/uploads/2022/06/the-rising-of-the-shield-hero-season-2-episode-13-english-subbed.jpg"
	},
	{
		logo:"https://upload.wikimedia.org/wikipedia/commons/2/2a/Dr._Stone_Logo.png",
		cover:"https://static1.moviewebimages.com/wordpress/wp-content/uploads/2023/02/dr-stone-season-3-featured.jpg?q=50&fit=contain&w=1140&h=&dpr=1.5"
	}
	]
</script>

<div class="featured relative h-fit">
	<div class="h-[600px] md:h-[600px] w-full relative">
		<div class="img relative h-full ml-auto">
			<img
				class="w-full h-full object-cover"
				src="https://static1.moviewebimages.com/wordpress/wp-content/uploads/2023/02/dr-stone-season-3-featured.jpg?q=50&fit=contain&w=1140&h=&dpr=1.5"
				alt=""
			/>
			<div
				class="absolute inset-x-0 h-48 bottom-0 bg-gradient-to-t from-base-100 to-transparent translate-y-1"
			/>
			<div class="absolute inset-x-0 h-48 top-0 bg-gradient-to-b from-base-100 to-transparent" />
			<div class="absolute inset-0 bg-gradient-to-r via-base-100/5 from-base-100 to-transparent" />
		</div>

		<div
			class="absolute left-0 bottom-10 px-4 md:px-6 lg:px-16 flex flex-col gap-6 items-start justify-end"
		>
			<div class="image">
				<img
					class="h-24 md:h-36"
					src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Dr._Stone_Logo.png"
					alt=""
				/>
			</div>

			<div class="info flex gap-3">
				<button class="btn btn-sm btn-neutral no-animation">Action</button>
				<button class="btn btn-sm btn-neutral no-animation">Science</button>
			</div>
			<p class="max-w-prose text-md">
				When a pregnant young starlet appears in Gorou Amemiya’s countryside medical clinic, the
				doctor takes it upon himself to safely (and secretly) deliver Ai Hoshino’s child so she can
				make a scandal-free return to the stage.
			</p>
			<div class="interact flex gap-4 items-center">
				<!-- <button class="btn btn-lg btn-primary rounded-full  aspect-square">
					<div class="icon flex translate-x-0.5">
						<Play fill="#17181c" size="32" strokeWidth=0/>
					</div>
				</button> -->
				<button class="btn btn-primary rounded-full flex items-center gap-2">
					<Play fill="#4B0055" size="20" strokeWidth=0 />
					<h1 class="font-bold hidden md:block">Play</h1>
				</button>
				<button class="btn btn-outline bg-base-100/40 rounded-full flex items-center gap-2">
					<ListVideo siz="20" />
					<h1 class="font-bold hidden md:block">Add to wathclist</h1>
				</button>
				<button class="btn btn-outline bg-base-100/40 rounded-full flex items-center gap-2">
					<Share size="20" />
					<h1 class="font-bold hidden md:block">Share</h1>
				</button>
			</div>
		</div>
	</div>
</div>

<!-- <div class="carouse-feat h-[600px] w-full border">
	<Splide aria-label="My Favorite Images">
		<SplideSlide>
			<img src="image1.jpg" alt="Image 1" />
		</SplideSlide>
		<SplideSlide>
			<img src="image2.jpg" alt="Image 2" />
		</SplideSlide>
	</Splide>
</div> -->
