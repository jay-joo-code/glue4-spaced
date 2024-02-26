<script lang="ts">
	import { page } from '$app/stores';
	import DemandButtonModal from '$lib/components/DemandButtonModal.svelte';
	import RequestRideButtonModal from '$lib/components/RequestRideButtonModal.svelte';
	import RideItem from '$lib/components/RideItem.svelte';
	import SearchInputGroup from '$lib/components/SearchInputGroup.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import waitlistImg from '$lib/illustrations/empty-state.jpg';
	import { format } from 'date-fns';
	import { onMount } from 'svelte';

	$: ({
		rides,
		originId,
		destinationId,
		waitlist,
		locations,
		queryDate,
		nearbyRideStats,
		otherRides
	} = $page.data);
	$: requestInflation = origin?.name.length + destination?.name.length;
	$: origin = locations?.find((location) => location?.id === originId);
	$: destination = locations?.find((location) => location?.id === destinationId);

	onMount(() => {
		// auto scroll to middle of horizontal scroll
		const nearbyDateButton = document.getElementById('button-2');
		if (nearbyDateButton) {
			nearbyDateButton.scrollIntoView({ inline: 'center' });
		}
	});
</script>

<PageContainer title={`Carpools from ${origin.name} to ${destination.name}`}>
	<div class="flex justify-center md:mt-12">
		<SearchInputGroup />
	</div>

	<!-- nearby ride stats -->
	<div class="relative mt-10 flex h-[4rem] items-center justify-center md:mt-20">
		<div
			class="flex max-w-[90vw] items-center overflow-auto rounded  border border-base-content/30"
		>
			{#each nearbyRideStats as [date, minPrice], idx}
				<a
					class="snap-center border-r border-base-content/30 px-4 py-2 last:border-none {idx === 2
						? 'bg-base-content [&_p]:text-base-100'
						: ''}"
					href={`/search?${new URLSearchParams({
						origin: origin.id,
						destination: destination.id,
						date: date.toISOString()
					}).toString()}`}
					id={`button-${idx}`}
				>
					<p class="mb-2 whitespace-nowrap text-center text-xs font-medium md:text-sm">
						{format(date, 'iii, MMM dd')}
					</p>
					{#if minPrice === null}
						<p class="text-center text-xs font-medium md:text-sm">-</p>
					{:else}
						<p class="text-center text-xs font-medium md:text-sm">${minPrice}</p>
					{/if}
				</a>
			{/each}
		</div>
	</div>

	{#if rides?.length > 0}
		<!-- rides list -->
		<div class="mt-12 flex items-center justify-between">
			<p class="text-sm font-medium">Showing {rides?.length} rides</p>
			<!-- TODO: sort select component -->
		</div>
		<div class="mt-6 space-y-4">
			{#each rides as ride (ride.id)}
				<RideItem {ride} />
			{/each}
		</div>
	{:else}
		<!-- empty state: request a ride -->
		<div class="mt-24 flex flex-col items-center">
			<img class="rounded-xl" src={waitlistImg} />
			<p class="mt-6 text-xl font-medium">No driver available</p>
			<p class="mt-2 max-w-xs text-center text-sm">
				Request a ride to notify all drivers that you're interested in this route.
			</p>
			<div class="mt-6">
				<RequestRideButtonModal
					{locations}
					date={queryDate}
					origin={origin.id}
					destination={destination.id}
				/>
			</div>
			<div class="mt-3">
				<DemandButtonModal
					{waitlist}
					originName={origin?.name}
					destinationName={destination?.name}
				/>
			</div>
		</div>

		{#if otherRides?.length > 0}
			<!-- other rides list -->
			<div class="mt-16 w-full border border-base-content/10" />

			<div class="my-16">
				<h2 class="text-xl font-semibold">Other rides to {destination?.name}</h2>
				<div class="mt-6 space-y-4">
					{#each otherRides as ride}
						<RideItem {ride} />
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</PageContainer>
