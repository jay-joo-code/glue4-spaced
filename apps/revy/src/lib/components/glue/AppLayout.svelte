<script>
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import Auth from '$lib/components/glue/Auth.svelte';
	import MobileDrawerContent from '$lib/components/glue/MobileDrawerContent.svelte';
	import { APP_NAME, IS_BETA, PUBLIC_NAVS } from '$lib/glue/config';
	import { currentUser } from '$lib/glue/pocketbase';
	import { onMount } from 'svelte';
	import StartDriveButtonModal from '../StartDriveButtonModal.svelte';
	import FeedbackModal from './FeedbackModal.svelte';
	import TrackWidth from './TrackWidth.svelte';
	import './app.css';
	import Footer from '../Footer.svelte';
	import * as Sentry from '@sentry/sveltekit';

	let topAnchor;

	afterNavigate(() => {
		if (topAnchor) {
			topAnchor.scrollIntoView();
		}
	});

	const identifyHeap = () => {
		if (browser && window && $currentUser) {
			const heapId = `${$currentUser?.name.replace(/\s/g, '-')}-${$currentUser?.id}`;
			window.heap?.identify(heapId);
			window.heap?.addUserProperties({
				id: $currentUser?.id,
				name: $currentUser?.name,
				email: $currentUser?.email
			});
		}
	};

	const identifySentry = () => {
		if (browser && window && $currentUser) {
			Sentry.setUser({
				id: $currentUser?.id,
				username: $currentUser?.name,
				email: $currentUser?.email
			});
		} else {
			Sentry.setUser(null);
		}
	};

	onMount(() => {
		identifyHeap();
		identifySentry();
	});
</script>

<TrackWidth />

<div class="w-screen">
	<div class="drawer">
		<!-- mobile nav: invisible drawer toggle -->
		<input id="drawer-mobile-nav" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content flex flex-col items-center">
			<div bind:this={topAnchor} />

			<!-- header -->
			<div class="sticky top-0 z-30 flex w-full justify-center bg-base-100/95">
				<div class={`w-full max-w-4xl`}>
					<div class="navbar px-4">
						<!-- mobile nav: hamburger -->
						<!-- {#if PUBLIC_NAVS?.length > 0}
							<div class="flex-none md:hidden">
								<label for="drawer-mobile-nav" class="btn-ghost drawer-button btn-square btn">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										class="inline-block h-5 w-5 stroke-current"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 6h16M4 12h16M4 18h16"
										/></svg
									>
								</label>
							</div>
						{/if} -->

						<!-- app name -->
						<div>
							<button>
								<a href="/" class="btn-ghost btn px-1 text-2xl font-bold normal-case">
									<p class="uppercase">{APP_NAME}</p>
									{#if IS_BETA}
										<span class="mt-2 text-sm text-base-content/60">beta</span>
									{/if}
								</a>
							</button>
						</div>

						<!-- right side menu -->
						<div class="flex flex-1 items-center justify-end space-x-2 md:space-x-3">
							<!-- public nav items -->
							<!-- <div class="hidden md:block">
								<div class="menu menu-horizontal p-2">
									{#if PUBLIC_NAVS?.length > 0}
										{#each PUBLIC_NAVS as nav}
											<li class="font-medium"><a href={nav.path}>{nav.label}</a></li>
										{/each}
									{/if}
								</div>
							</div> -->
							<StartDriveButtonModal />
							<Auth />
						</div>
					</div>
				</div>
			</div>
			<div class="relative w-full">
				<!-- body content -->
				<div class="min-h-[82vh]">
					<slot />
				</div>

				<!-- footer -->
				<Footer />

				<!-- feedback -->
				<FeedbackModal />
			</div>
		</div>

		<!-- mobile nav: drawer content -->
		<MobileDrawerContent />
	</div>
</div>
