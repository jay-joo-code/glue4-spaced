<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import DatePicker from '$lib/components/glue/DatePicker.svelte';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import { toast } from '@zerodevx/svelte-toast';
	import { format, parse, set, sub } from 'date-fns';
	import DemandButtonModal from './DemandButtonModal.svelte';
	import TermsNotice from './TermsNotice.svelte';
	import UserAvatar from './UserAvatar.svelte';
	import Textarea from './glue/Textarea.svelte';

	export let initialValues = null;

	let dialog;

	let origin: string | null = null;
	let destination: string | null = null;
	let seats: number | null = null;
	let price: number | null = null;
	let date: Date | null = null;
	let time: string | null = null;
	let datetime: Date | null = null;
	let desc: string | null = null;
	let isLoading = false;
	let error: string | null = null;
	let waitlist = null;

	$: if (date && time) {
		const parsedTime = parse(time, 'HH:mm', new Date());
		datetime = set(parsedTime, {
			year: date.getFullYear(),
			month: date.getMonth(),
			date: date.getDate()
		});
	}
	$: populateInitialValues(initialValues);
	$: ({ locations } = $page?.data);
	$: if (origin && destination) {
		fetchWaitlist(origin, destination);
	}
	$: originName = origin ? locations?.find((location) => location?.id === origin)?.name : null;
	$: destinationName = destination
		? locations?.find((location) => location?.id === destination)?.name
		: null;

	const handleSaveDrive = async () => {
		isLoading = true;

		try {
			if (!origin || !destination || !date || !time || !seats || !price) {
				error = 'Please fill out all of your trip details';
			} else {
				if (initialValues) {
					await pb.collection('rides').update(initialValues?.id, {
						origin,
						destination,
						datetime,
						driver: $currentUser?.id,
						price,
						seats,
						isTimeFlexible: false,
						isUnavailable: false,
						desc
					});
				} else {
					await pb.collection('rides').create({
						origin,
						destination,
						datetime,
						driver: $currentUser?.id,
						price,
						seats,
						isTimeFlexible: false,
						isUnavailable: false,
						desc
					});

					// only reset if no initial values (creating, not editing)
					origin = null;
					destination = null;
					seats = null;
					price = null;
					date = null;
					time = null;
					datetime = null;
					error = null;
					desc = null;
				}
				await invalidateAll();
				dialog?.close();
				toast.push('✅ Carpool was successfully saved');
				goto('/driver-dashboard');
			}
		} catch (error) {}
		isLoading = false;
	};

	const populateInitialValues = (values) => {
		if (values) {
			origin = values?.origin;
			destination = values?.destination;
			seats = values?.seats;
			price = values?.price;
			date = new Date(values?.datetime);
			time = format(new Date(values?.datetime), 'HH:mm');
			desc = values?.desc;
		}
	};

	const fetchWaitlist = async (originId, destinationId) => {
		const oneMonthAgo = sub(new Date(), { months: 1 });
		waitlist =
			(
				await pb.collection('waitlists').getFullList(200, {
					filter: `origin="${originId}" && destination="${destinationId}" && date > "${oneMonthAgo?.toISOString()}"`,
					sort: 'date',
					expand: 'user',
					fetch: async (url) => fetch(url)
				})
			).map((record) => structuredClone(record)) || null;
	};
</script>

<button
	class="btn-primary btn-sm btn"
	on:click={() => {
		dialog?.showModal();
	}}
>
	<slot />
</button>

<dialog bind:this={dialog} class="modal cursor-pointer">
	<div class="modal-box relative box-border max-h-[70vh]">
		<form on:submit|preventDefault={handleSaveDrive}>
			<h2 class="text-2xl font-semibold">
				{#if initialValues}
					Edit ride
				{:else}
					Post a ride
				{/if}
			</h2>

			<div class="my-8 w-full border-t border-base-content/10" />

			<div class="grid grid-cols-4 gap-x-4 gap-y-6">
				<div class="flex items-center">
					<label class="font-medium">Driver</label>
				</div>
				<div class="col-span-3">
					<UserAvatar user={$currentUser} />
				</div>

				<div class="flex items-center">
					<label class="font-medium">From</label>
				</div>
				<div class="col-span-3">
					<!-- TODO: add a new location button OR change to input with autocomplete -->
					<select class="select w-full bg-base-200" bind:value={origin}>
						<option disabled value={null}>Driving from</option>
						{#each locations as location}
							<option value={location.id}>{location.name}</option>
						{/each}
					</select>
				</div>

				<div class="mt-2 flex items-start">
					<label class="font-medium">To</label>
				</div>
				<div class="col-span-3">
					<!-- TODO: add a new location button OR change to input with autocomplete -->
					<select class="select w-full bg-base-200" bind:value={destination}>
						<option disabled value={null}>Driving to</option>
						{#each locations as location}
							<option value={location.id}>{location.name}</option>
						{/each}
					</select>
					{#if waitlist && waitlist?.length > 0}
						<div class="-ml-4 flex justify-start">
							<DemandButtonModal {waitlist} {originName} {destinationName} />
						</div>
					{/if}
				</div>

				<div class="flex items-center">
					<label class="font-medium">Date</label>
				</div>
				<div class="col-span-3 [&_input]:!bg-base-200">
					<DatePicker bind:value={date} />
				</div>

				<div class="flex items-center">
					<label class="font-medium">Leaving time</label>
				</div>
				<div class="col-span-3">
					<input type="time" class="input w-full bg-base-200" bind:value={time} />
				</div>

				<div class="flex items-center">
					<label class="font-medium">Available seats</label>
				</div>
				<div class="col-span-3">
					<input type="number" class="input w-full bg-base-200" bind:value={seats} />
				</div>

				<div class="flex items-start">
					<label class="font-medium md:mt-3">Price per seat</label>
				</div>
				<div class="col-span-3 ">
					<div class="flex items-center">
						<p class="mr-2 font-medium">$</p>
						<input
							type="number"
							class="input w-full bg-base-200 {price && price > 40 ? 'input-warning' : ''}"
							bind:value={price}
						/>
					</div>
					{#if price && price > 40}
						<div class="">
							<p class="mt-4 text-xs text-base-content/80">
								Carpools that are less than <span class="font-bold text-warning">$40</span> per seat
								tend to receive more reservations.
							</p>
						</div>
					{/if}
				</div>

				<div class="flex items-start">
					<label class="font-medium">Description</label>
				</div>
				<div class="col-span-3">
					<Textarea
						class="input w-full bg-base-200"
						bind:value={desc}
						placeholder="Details about your trip"
					/>
				</div>
			</div>

			<button class="btn-primary btn-block btn mt-8" disabled={isLoading}>
				{#if isLoading}
					<span class="loading loading-spinner loading-xs" />
				{/if}
				Save ride
			</button>

			{#if error}
				<p class="mt-4 text-center text-xs text-error">{error}</p>
			{/if}
			<div class="my-8">
				<TermsNotice />
			</div>
		</form>
	</div>

	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
