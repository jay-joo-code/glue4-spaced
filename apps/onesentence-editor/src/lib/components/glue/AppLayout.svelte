<script>
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { currentUser } from '$lib/glue/pocketbase';
	import * as Sentry from '@sentry/sveltekit';
	import { onMount } from 'svelte';
	import Footer from '../Footer.svelte';
	import FeedbackModal from './FeedbackModal.svelte';
	import TrackWidth from './TrackWidth.svelte';
	import './app.css';
	import Navbar from '$root/../shared/components/Navbar.svelte';
	import { APP_NAME } from '../../glue/config';

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
	<Navbar appName={APP_NAME} />

	<div class="flex flex-col items-center">
		<div bind:this={topAnchor} />

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
</div>
