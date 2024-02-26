<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import DatePicker from '$lib/components/glue/DatePicker.svelte';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import rideRequestSuccessImg from '$lib/illustrations/ride-request-success.png';
	import TermsNotice from './TermsNotice.svelte';
	import RequireAuthButton from './glue/RequireAuthButton.svelte';

	export let locations = [];
	export let origin: string | null = null;
	export let destination: string | null = null;
	export let date: Date;

	let isLoading = false;
	let error: string;

	const handleCreateRequest = async () => {
		isLoading = true;

		// TODO: improve error handling
		try {
			if (!origin || !destination || !date) {
				error = 'Please fill out all of your trip details';
			} else {
				await pb.collection('waitlists').create({
					origin,
					destination,
					date,
					user: $currentUser?.id
				});
				await invalidateAll();

				if (document?.querySelector('#modal-request-ride')) {
					document.querySelector('#modal-request-ride').checked = false;
				}
				if (document?.querySelector('#modal-request-ride-success')) {
					document.querySelector('#modal-request-ride-success').checked = true;
				}
			}
		} catch (error) {}
		isLoading = false;
	};
</script>

{#if $currentUser}
	<label for="modal-request-ride" class="btn-primary btn md:btn-md">Request a Ride</label>
{:else}
	<RequireAuthButton class="btn-primary btn md:btn-md">Request a Ride</RequireAuthButton>
{/if}

<input type="checkbox" id="modal-request-ride" class="modal-toggle" />
<label for="modal-request-ride" class="modal cursor-pointer">
	<label class="modal-box relative box-border max-h-[70vh]" for="">
		<form on:submit|preventDefault={handleCreateRequest}>
			<h2 class="text-2xl font-semibold">Request a Ride</h2>

			<div class="my-8 w-full border-t border-base-content/10" />

			<div class="grid grid-cols-4 gap-x-4 gap-y-6">
				<div class="flex items-center">
					<label class="font-medium">From</label>
				</div>
				<div class="col-span-3">
					<select class="select w-full bg-base-200" bind:value={origin}>
						<option disabled value={null}>Leaving from</option>
						{#each locations as location}
							<option value={location.id}>{location.name}</option>
						{/each}
					</select>
				</div>

				<div class="flex items-center">
					<label class="font-medium">To</label>
				</div>
				<div class="col-span-3">
					<select class="select w-full bg-base-200" bind:value={destination}>
						<option disabled value={null}>Arriving at</option>
						{#each locations as location}
							<option value={location.id}>{location.name}</option>
						{/each}
					</select>
				</div>

				<div class="flex items-center">
					<label class="font-medium">Date</label>
				</div>
				<div class="col-span-3 [&_input]:!bg-base-200">
					<DatePicker bind:value={date} />
				</div>
			</div>

			<button class="btn-primary btn-block btn mt-8" disabled={isLoading}>
				{#if isLoading}
					<span class="loading loading-spinner loading-xs" />
				{/if}
				Request a Ride
			</button>

			{#if error}
				<p class="mt-4 text-center text-xs text-error">{error}</p>
			{/if}
		</form>
	</label>
</label>

<input type="checkbox" id="modal-request-ride-success" class="modal-toggle" />
<label for="modal-request-ride-success" class="modal cursor-pointer">
	<label class="modal-box relative box-border h-[40vh]" for="">
		<div class="flex h-full flex-col justify-between">
			<div class="">
				<!-- TODO: modal close button -->
			</div>
			<div class="flex flex-col items-center">
				<img
					class="rounded-lg"
					src={rideRequestSuccessImg}
					alt="ride request success illustration"
				/>
				<h2 class="mt-6 text-center text-2xl font-semibold">You've requested a ride!</h2>
				<p class="mt-4 max-w-sm text-center text-xs text-base-content/80 md:text-sm">
					You’ll be notified via email when a driver is available for this route. In the mean time
					you can explore other rides
				</p>
			</div>

			<label for="modal-request-ride-success" class="btn-primary btn-block btn">
				Explore other rides
			</label>
		</div>
	</label>
</label>
