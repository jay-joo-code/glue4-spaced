<script lang="ts">
	import { page } from '$app/stores';
	import RideItem from '$lib/components/RideItem.svelte';
	import StartDriveButtonModal from '$lib/components/StartDriveButtonModal.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import emptyStateImg from '$lib/illustrations/empty-state.jpg';

	let isLoadingRides = false;

	$: ({ myDrives } = $page?.data);
</script>

<PageContainer title="Driver dashboard">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-extrabold">Driver dashboard</h1>
		<StartDriveButtonModal />
	</div>

	<!-- TODO: upcoming, completed drives section -->

	{#if isLoadingRides}
		<!-- loading state -->
		<div class="mt-8 space-y-4">
			<div class="h-[10rem] w-full animate-pulse rounded-xl bg-base-300" />
			<div class="h-[10rem] w-full animate-pulse rounded-xl bg-base-300" />
			<div class="h-[10rem] w-full animate-pulse rounded-xl bg-base-300" />
		</div>
	{:else if myDrives?.length > 0}
		<!-- my drives list -->
		<div class="mt-8">
			<h2 class="text-lg font-bold">Postings</h2>
			<div class="mt-4 space-y-4">
				{#each myDrives as ride (ride.id)}
					<RideItem {ride} />
				{/each}
			</div>
		</div>
	{:else}
		<!-- empty state -->
		<div class="mt-[15vh] flex flex-col items-center">
			<img class="rounded-xl" src={emptyStateImg} />
			<p class="mt-6 text-2xl font-medium">No drives yet</p>
			<p class="mt-3 max-w-xs text-center text-sm">
				Create a drive to get started as a driver and begin your carpooling journey
			</p>
		</div>
	{/if}

	<!-- TODO: demand section -->
</PageContainer>
