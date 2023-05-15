<script>
	import 'iconify-icon';
	import { page } from '$app/stores';
	import {
		Home,
		Search,
		ListVideo,
		AlignJustify,
		UserCircle,
		Users,
		Plane,
		User
	} from 'lucide-svelte';

	export let y;
</script>

<header
	aria-label="Site Header"
	class={`${
		y > 20 || $page.route.id !== '/'
			? 'bg-neutral  shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]'
			: 'bg-neutral/0'
	} fixed top-0 inset-x-0 h-fit z-20 transition-all duration-300`}
>
	<!-- <div class="announcement">
		<div class="flex items-center justify-between gap-4 bg-primary px-4 py-3 text-base-100">
			<div class="heading flex gap-2 mx-auto items-center">
				<p class="text-sm font-medium ">
					Loved Candyfloss?
					<a href="#" class="inline-block underline">We are currently on beta expect buggs!</a>
				</p>
				<div class="icon flex text-2xl">
					<iconify-icon icon="streamline-emojis:bug" />
				</div>
			</div>

			<button
				aria-label="Close"
				class="shrink-0 rounded-lg bg-black/10 p-1 transition hover:bg-black/20"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</svg>
			</button>
		</div>
	</div> -->
	<div class="mx-auto flex h-16 items-center gap-10 px-4 md:px-6 lg:px-16 py-10">
		<!-- logo -->
		<a class="flex items-center gap-3 h-full" href="/">
			<span class="sr-only">Home</span>
			<div class="icon text-5xl">
				<iconify-icon icon="skill-icons:vite-dark" />
			</div>
			<h1 class="font-semibold text-lg md:text-xl lg:text-2xl">
				candy<span class="text-primary">floss.to</span>
			</h1>
		</a>

		<div class="flex flex-1 items-center justify-end md:justify-between h-full">
			<!-- links -->
			<nav aria-label="Site Nav" class="hidden md:block">
				<ul class="relative flex gap-6 items-center translate-y-0.5">
					<a href="/"
						><li
							class={`${
								$page.url.pathname === '/' ? 'font-extrabold ' : 'opacity-50'
							} flex gap-2 items-center `}
						>
							<div class="icon flex -translate-y-0.5">
								<Home size="20" />
							</div>
							<h1 class="font-semibold">HOME</h1>
						</li></a
					>
					<a href="/search"
						><li
							class={`${
								$page.url.pathname === '/search' ? 'font-extrabold ' : 'opacity-50'
							} flex gap-2 items-center `}
						>
							<div class="icon flex">
								<Search size="20" />
							</div>
							<h1 class="font-semibold">SEARCH</h1>
						</li></a
					>
					<a href="/my-list"
						><li
							class={`${
								$page.url.pathname === '/my-list' ? 'font-extrabold ' : 'opacity-50'
							} flex gap-2 items-center `}
						>
							<div class="icon flex">
								<ListVideo size="20" />
							</div>
							<h1 class="font-semibold">MY LIST</h1>
						</li></a
					>
				</ul>
			</nav>

			<!-- profile -->
			<div class="flex items-center gap-4">
				<div class="flex gap-2 items-center">
					<button class="btn btn-primary px-6 flex gap-2 items-center">
						<h1>Login</h1>
					</button>
					<!-- <h1 class="font-medium">Login</h1>
					<div class="icon text-base-content  flex">
						<UserCircle/>
					</div> -->
				</div>

				<button class="btn block rounded p-2.5 transition bg-neutral md:hidden">
					<span class="sr-only">Toggle menu</span>
					<AlignJustify />
				</button>
			</div>
		</div>
	</div>
</header>
