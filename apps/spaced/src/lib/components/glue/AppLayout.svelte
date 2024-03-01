<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import { APP_NAME, IS_BETA, PUBLIC_NAVS } from '$lib/glue/config';
	import Auth from './Auth.svelte';
	import FeedbackModal from './FeedbackModal.svelte';
	import Footer from './Footer.svelte';
	import TrackWidth from './TrackWidth.svelte';
	import './app.css';

	let topAnchor;
	let isDrawerOpen: boolean = false;

	afterNavigate(() => {
		if (topAnchor) {
			topAnchor.scrollIntoView();
		}
	});
</script>

<TrackWidth />

<div class="w-screen">
	<div class="drawer">
		<!-- mobile nav: invisible drawer toggle -->
		<input
			id="drawer-mobile-nav"
			type="checkbox"
			class="drawer-toggle"
			bind:checked={isDrawerOpen} />
		<div class="drawer-content flex flex-col items-center">
			<div bind:this={topAnchor} />

			<!-- header -->
			<div class="sticky top-0 z-30 flex w-full justify-center bg-base-100/95">
				<div class="w-full max-w-6xl px-4 {PUBLIC_NAVS?.length > 0 && 'pl-1'}">
					<div class="navbar min-h-[unset] px-0">
						<!-- mobile nav: hamburger -->
						{#if PUBLIC_NAVS?.length > 0}
							<div class="flex-none md:hidden">
								<button
									class="btn-ghost drawer-button btn-square btn w-auto px-2"
									on:click={() => {
										isDrawerOpen = true;
									}}>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										class="inline-block h-5 w-5 stroke-current">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 6h16M4 12h16M4 18h16" />
									</svg>
								</button>
							</div>
						{/if}

						<!-- app name -->
						<div>
							<button>
								<a href="/" class="btn-ghost btn-sm btn px-1 text-xl normal-case">
									{APP_NAME}
									{#if IS_BETA}
										<span class="mt-1 hidden text-sm text-base-content/60 md:block">beta</span>
									{/if}
								</a>
							</button>
						</div>

						<!-- right side public navs -->
						<div class="flex flex-1 justify-end">
							<div class="hidden md:block">
								<div class="menu menu-horizontal px-2">
									{#if PUBLIC_NAVS?.length > 0}
										{#each PUBLIC_NAVS as nav}
											{#if nav.path !== '/signin' || !$page?.data?.session}
												<li class="text-sm font-semibold"><a href={nav.path}>{nav.label}</a></li>
											{/if}
										{/each}
									{/if}
								</div>
							</div>
						</div>

						<!-- authed avatar -->
						<Auth />
					</div>
				</div>
			</div>
			<div class="relative w-full">
				<!-- body content -->
				<div class="min-h-[85vh]">
					<slot />
				</div>

				<!-- footer -->
				<Footer />

				<!-- feedback -->
				<FeedbackModal />
			</div>
		</div>

		<!-- mobile nav: drawer content -->
		<div class="drawer-side">
			<label for="drawer-mobile-nav" class="drawer-overlay" />
			<div class="w-80 bg-base-200 p-4 text-base-content">
				<button>
					<a class="btn-ghost btn px-2 text-xl normal-case">
						{APP_NAME}
						{#if IS_BETA}
							<span class="ml-1.5 mt-1 text-sm text-base-content/60">beta</span>
						{/if}
					</a>
				</button>
				<ul class="menu mt-2 rounded-xl bg-base-100 p-2">
					{#each PUBLIC_NAVS as nav}
						{#if nav.path !== '/signin' || !$page?.data?.session}
							<li
								class="font-semibold"
								on:click={() => {
									isDrawerOpen = false;
								}}>
								<a href={nav.path}>{nav.label}</a>
							</li>
						{/if}
					{/each}
				</ul>
			</div>
		</div>
	</div>
</div>
