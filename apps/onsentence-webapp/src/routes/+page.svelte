<script lang="ts">
	import { page } from '$app/stores';
	import LoadingRides from '$lib/components/LoadingRides.svelte';
	import RideItem from '$lib/components/RideItem.svelte';
	import SearchInputGroup from '$lib/components/SearchInputGroup.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import IconSearch from '$lib/icons/glue/IconSearch.svelte';
	import IntersectionObserver from 'svelte-intersection-observer';

	let element;
	let intersecting;

	$: ({ lazy } = $page.data);
</script>

<PageContainer title="Home">
	<div class="flex flex-col items-center">
		<!-- Desktop View -->
		<div class=" mt-12 hidden rounded bg-base-200 p-3 text-center md:mt-32 md:block">
			<h1 class="font-serifPro text-4xl  md:whitespace-nowrap">
				Ride Together, Save&nbsp;Together
			</h1>
		</div>
		<!-- Mobile View -->
		<div class="mt-10 w-full p-5 text-left md:hidden">
			<h1 class="font-serifPro text-4xl leading-none">Ride Together,</h1>
			<h1 class="pt-3 font-serifPro text-4xl leading-none">Save Together</h1>
			<p class="text-md mt-2 pt-3 font-medium text-base-content/80">
				Carpool Platform for all Cornellians
			</p>
		</div>

		<p
			class="text-md md:text-md mt-2 hidden text-center font-medium text-base-content/80 md:block md:text-left"
		>
			Carpool Platform for Cornell Students
		</p>

		<IntersectionObserver {element} bind:intersecting threshold={0.5}>
			<div class="mt-12 w-full md:mt-16" bind:this={element}>
				<SearchInputGroup />
			</div>
		</IntersectionObserver>

		{#if !intersecting}
			<div class="fixed top-24 z-20">
				<div class="flex items-center justify-center rounded-full py-3 px-4 backdrop-blur-lg">
					<button
						class="btn-primary btn rounded-full drop-shadow-2xl"
						on:click={() => {
							window.scrollTo({
								top: 0,
								behavior: 'smooth'
							});
						}}
						><span class="text-xl"><IconSearch /></span>Search for rides
					</button>
				</div>
			</div>
		{/if}

		<!-- upcoming rides -->
		<div class="relative my-32 flex min-h-[40vh] w-full flex-col items-center">
			<div class="w-full max-w-xl">
				<h2 class="mb-4 pb-2 text-xl font-semibold text-base-content/60">Upcoming rides</h2>
				{#await lazy.rides}
					<LoadingRides />
				{:then rides}
					<div class="w-full space-y-7">
						{#each rides as ride (ride?.id)}
							<RideItem {ride} />
						{/each}
					</div>

					{#if rides?.length === 40}
						<div class="absolute inset-x-0 bottom-0 h-96 w-full bg-gradient-to-t from-base-100" />
					{/if}
				{/await}
			</div>
		</div>
	</div>
</PageContainer>
