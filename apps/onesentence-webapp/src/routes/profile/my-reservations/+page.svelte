<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import LoadingRides from '$lib/components/LoadingRides.svelte';
	import RideItem from '$lib/components/RideItem.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import { pb } from '$lib/glue/pocketbase';
	import IconCalendar from '$lib/icons/glue/IconCalendar.svelte';
	import IconRightArrowLong from '$lib/icons/glue/IconRightArrowLong.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { format } from 'date-fns';

	let isLoadingWaitlistId: number | null = null;

	$: ({ myBookings, myWaitlists } = $page?.data);

	const handleDeleteWaitlist = async (waitlistId) => {
		isLoadingWaitlistId = waitlistId;

		try {
			await pb.collection('waitlists').delete(waitlistId);
			await invalidateAll();
			toast.push('✅ Unsubscribed from this route');
		} catch (error) {}

		isLoadingWaitlistId = null;
	};
</script>

<PageContainer>
	<h2 class="mt-4 text-2xl font-extrabold">My reservations</h2>

	<div class="mt-6">
		{#await myBookings}
			<LoadingRides />
		{:then myBookings}
			{#each myBookings as booking}
				<div class="my-4">
					<RideItem ride={booking?.expand?.ride} />
				</div>
			{/each}
		{/await}
	</div>

	{#if myWaitlists?.length > 0}
		<div class="my-24">
			<h2 class="text-2xl font-extrabold">Ride requests</h2>
			<p class="mt-3 text-sm font-medium text-base-content/70">
				Unsubscribe to stop getting email notifications about new rides
			</p>
			<div class="mt-6 space-y-4">
				{#each myWaitlists as waitlist}
					<div class="flex items-center justify-between">
						<div class="">
							<!-- origin, destination -->
							<div class="mt-1">
								<p class="break-all text-lg font-medium">
									{waitlist?.expand?.origin?.name}
									<span class="mt-1 inline text-3xl [&_svg]:inline">
										<IconRightArrowLong />
									</span>
									{waitlist?.expand?.destination?.name}
								</p>
							</div>

							<!-- date -->
							<div class="mt-2 flex items-center space-x-3">
								<div class="text-base-content/80">
									<IconCalendar />
								</div>
								{#if waitlist?.date}
									<p class="text-sm">
										{format(new Date(waitlist?.date), 'dd MMM yyyy')}
									</p>
								{/if}
							</div>
						</div>

						<button
							class="btn-primary btn"
							disabled={Boolean(isLoadingWaitlistId)}
							on:click={() => {
								handleDeleteWaitlist(waitlist?.id);
							}}
						>
							{#if isLoadingWaitlistId === waitlist?.id}
								<span class="loading loading-spinner loading-xs" />
							{/if}
							Unsubscribe</button
						>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</PageContainer>
