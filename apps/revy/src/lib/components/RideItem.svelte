<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import IconCalendar from '$lib/icons/glue/IconCalendar.svelte';
	import IconClock from '$lib/icons/glue/IconClock.svelte';
	import IconDocs from '$lib/icons/glue/IconDocs.svelte';
	import IconDriverWheel from '$lib/icons/glue/IconDriverWheel.svelte';
	import IconMessage from '$lib/icons/glue/IconMessage.svelte';
	import IconRightArrowLong from '$lib/icons/glue/IconRightArrowLong.svelte';
	import IconSeat from '$lib/icons/glue/IconSeat.svelte';
	import reservationPendingImg from '$lib/illustrations/reservation-pending.png';
	import { toast } from '@zerodevx/svelte-toast';
	import { format, formatDistanceToNowStrict } from 'date-fns';
	import RideFormButtonModal from './RideFormButtonModal.svelte';
	import TermsNotice from './TermsNotice.svelte';
	import UserAvatar from './UserAvatar.svelte';
	import RequireAuthButton from './glue/RequireAuthButton.svelte';
	import IconUpKarat from '$lib/icons/glue/IconUpKarat.svelte';

	export let ride;
	export let booking = null;
	export let onCardCollapse;

	let isLoadingBook = false;
	let isLoadingStateChange = false;
	let isLoadingDelete = false;
	let createdBookingId;

	$: isComplete = new Date(ride?.datetime) < new Date();
	$: approvedBookings =
		ride?.expand['bookings(ride)']?.filter((booking) => booking?.state === 'APPROVED') || [];
	$: remainingSeats = ride?.seats - approvedBookings?.length;
	$: currentUserBooking = ride?.expand['bookings(ride)']?.find(
		(booking) => booking?.requestor === $currentUser?.id
	);
	$: bookingData = booking || currentUserBooking;

	const handleBookRide = async () => {
		isLoadingBook = true;

		try {
			const existingChatroom = await pb
				.collection('bookings')
				.getFirstListItem(`ride="${ride?.id}" && requestor="${$currentUser?.id}"`);
			goto(`/chatrooms/${existingChatroom?.id}`);
		} catch (error) {
			if (error?.status === 404) {
				try {
					const booking = await pb.collection('bookings').create({
						ride: ride?.id,
						driver: ride?.driver,
						requestor: $currentUser?.id,
						state: 'PENDING'
					});
					createdBookingId = booking?.id;
					await fetch('/api/email', {
						method: 'POST',
						body: JSON.stringify({
							variant: 'BOOKING_CREATE',
							receiverId: ride?.driver,
							templateProps: {
								requestorName: $currentUser?.name,
								bookingId: booking?.id
							}
						}),
						headers: {
							'content-type': 'application/json'
						}
					});
					if (document?.querySelector(`#modal-reservation-pending-${ride?.id}`)) {
						document.querySelector(`#modal-reservation-pending-${ride?.id}`).checked = true;
					}
				} catch (error) {}
			}
		}

		isLoadingBook = false;
	};

	const showBookRideModal = () => {
		if (document?.querySelector(`#modal-reserve-confirmation-${ride?.id}`)) {
			document.querySelector(`#modal-reserve-confirmation-${ride?.id}`).checked = true;
		}
	};

	const showDeleteRideModal = () => {
		if (document?.querySelector(`#modal-delete-confirmation-${ride?.id}`)) {
			document.querySelector(`#modal-delete-confirmation-${ride?.id}`).checked = true;
		}
	};

	const handleDeleteRide = async () => {
		isLoadingDelete = true;

		try {
			await pb.collection('rides').delete(ride?.id);
			await invalidateAll();

			toast.push('✅ Ride deleted');
		} catch (error) {}

		isLoadingDelete = false;
	};
</script>

<div class="w-full rounded-xl border border-base-content/20 px-4 py-6 md:px-6 md:py-7">
	<!-- created timestamp -->
	<div class="flex items-center justify-between">
		<div class="">
			<p class="text-xs text-base-content/80">
				Posted {formatDistanceToNowStrict(new Date(ride?.created))} ago
			</p>
		</div>
		{#if ride?.desc}
			<div class="tooltip text-left" data-tip={ride?.desc}>
				<button class="btn-ghost btn-sm btn px-1 text-warning">
					<span class="text-lg">
						<IconDocs />
					</span>
					Driver's Note
				</button>
			</div>
		{/if}
	</div>

	<div class="flex justify-between">
		<div>
			<!-- origin, destination -->
			<div class="mt-1">
				<p class="break-all text-xl font-bold">
					{ride?.expand?.origin?.name}
					<span class="mt-1 inline text-3xl [&_svg]:inline">
						<IconRightArrowLong />
					</span>
					{ride?.expand?.destination?.name}
				</p>
			</div>

			<!-- departure date -->
			<div class="mt-3 flex items-center space-x-3">
				<div class="text-base-content/80">
					<IconCalendar />
				</div>
				<p class="text-sm">
					{format(new Date(ride?.datetime), 'dd MMM yyyy')}
				</p>
			</div>

			<!-- departure time -->
			{#if !ride?.isTimeFlexible}
				<div class="mt-3 flex items-center space-x-3">
					<div class="text-base-content/80">
						<IconClock />
					</div>
					<p class="text-sm">
						Departing at {format(new Date(ride?.datetime), 'h:mm a')}
					</p>
				</div>
			{/if}

			<!-- seat count -->
			{#if remainingSeats > 0}
				<div class="mt-3 flex items-center space-x-3">
					<div class="text-base-content/80">
						<IconSeat />
					</div>
					<p class="text-sm">
						{remainingSeats} of {ride?.seats} seats available
					</p>
				</div>
			{/if}

			<!-- driver -->
			<div class="mt-4">
				<div class="flex items-center space-x-3">
					<div class="text-base-content/80">
						<IconDriverWheel />
					</div>
					<div class="ml-2">
						<UserAvatar user={ride?.expand?.driver} />
					</div>
				</div>
			</div>

			<!-- approved riders -->
			{#each approvedBookings as booking}
				<div class="mt-3">
					<div class="flex items-center">
						<div class="text-base-content/80">
							<IconSeat />
						</div>
						<div class="ml-3">
							<UserAvatar user={booking?.expand?.requestor} />
						</div>
						{#if ride?.driver === $currentUser?.id}
							<a class="ml-1" href="/chatrooms/{booking?.id}">
								<button class="btn-ghost btn-sm btn rounded-full text-xl text-primary"
									><IconMessage /></button
								>
							</a>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<div class="mt-4 flex items-end justify-between">
		<!-- price -->
		<p class="text-2xl font-bold">
			${ride?.price} <span class="text-sm font-medium text-base-content/80">/ seat</span>
		</p>

		<!-- action buttons: request, edit, delete, completed, collapse -->
		<div>
			{#if Boolean(onCardCollapse)}
				<div class="flex items-end">
					<button class="btn-ghost btn-sm btn-circle btn text-3xl" on:click={onCardCollapse}>
						<IconUpKarat />
					</button>
				</div>
			{:else if ride?.driver === $currentUser?.id && !booking}
				<div class="flex items-center space-x-3">
					<RideFormButtonModal initialValues={ride}>Edit</RideFormButtonModal>
					<button class="btn-primary btn-sm btn" on:click={showDeleteRideModal}>Delete</button>
				</div>
			{:else if bookingData?.state === 'PENDING'}
				<button class="btn-primary btn !bg-base-300 px-8" disabled={true}>Pending</button>
			{:else if bookingData?.state === 'APPROVED'}
				<div class="btn-success btn-outline btn cursor-default !bg-green-50 px-8 !text-green-700">
					Approved
				</div>
			{:else if bookingData?.state === 'DECLINED'}
				<div class="btn-success btn-outline btn cursor-default !bg-red-50 px-8 !text-red-700">
					Declined
				</div>
			{:else if remainingSeats === 0}
				<button class="btn px-8" disabled={true}>Sold out</button>
			{:else if isComplete}
				<div class="btn cursor-default">Completed</div>
			{:else}
				<RequireAuthButton class="btn-primary btn px-8" on:click={showBookRideModal}>
					{#if isLoadingBook}
						<span class="loading loading-spinner loading-xs" />
					{/if}
					Reserve
				</RequireAuthButton>
			{/if}
		</div>
	</div>

	{#if currentUserBooking && !$page?.url?.pathname?.includes('/chatrooms')}
		<div class="mt-4">
			<a href="/chatrooms/{currentUserBooking?.id}">
				<button class="btn-primary btn-ghost btn-sm btn px-1 text-primary">
					<IconMessage />
					Message driver
				</button>
			</a>
		</div>
	{/if}
</div>

<!-- reserve confirmation modal -->
<input type="checkbox" id="modal-reserve-confirmation-{ride?.id}" class="modal-toggle" />
<label for="modal-reserve-confirmation-{ride?.id}" class="modal cursor-pointer">
	<label class="modal-box relative box-border max-w-md" for="">
		<h2 class="text-xl font-semibold">Reserve this ride?</h2>
		<p class="mt-4 text-sm leading-relaxed text-base-content/80">
			Please note that reserving the ride is not a confirmation. The driver has the right to either
			approve or decline your request. You will be notified about the driver's decision.
		</p>
		<button
			class="btn-primary btn-block btn mt-10"
			on:click={handleBookRide}
			disabled={isLoadingBook}
		>
			{#if isLoadingBook}
				<span class="loading loading-spinner loading-xs" />
			{/if}
			Reserve
		</button>
		<div class="mt-4">
			<TermsNotice />
		</div>
	</label>
</label>

<!-- reservation pending modal -->
<input type="checkbox" id="modal-reservation-pending-{ride?.id}" class="modal-toggle" />
<label for="modal-reservation-pending-{ride?.id}" class="modal cursor-pointer">
	<label class="modal-box relative box-border" for="">
		<div class="flex justify-center">
			<img class="rounded-xl" src={reservationPendingImg} alt="reservation pending illustration" />
		</div>
		<h2 class="mt-6 text-center text-xl font-semibold">Your reservation is pending!</h2>
		<p class="mt-3 text-center text-sm text-base-content/80">
			The driver has been notified. Your booking is pending approval and you’ll secure your ride
			once the driver approves your request.
		</p>
		<a href="/chatrooms/{createdBookingId}">
			<button class="btn-primary btn-block btn mt-12">Message driver</button>
		</a>
	</label>
</label>

<!-- delete confirmation modal -->
<input type="checkbox" id="modal-delete-confirmation-{ride?.id}" class="modal-toggle" />
<label for="modal-delete-confirmation-{ride?.id}" class="modal cursor-pointer">
	<label class="modal-box relative box-border max-w-sm" for="">
		<h2 class="text-xl font-semibold">Delete this ride?</h2>
		<p class="mt-4 text-sm leading-relaxed text-base-content/80">
			Please note that your ride and any associated reservations will be permanently deleted. If you
			have any riders, please let them know before canceling the ride.
		</p>
		<button
			class="btn-primary btn-block btn mt-10"
			on:click={handleDeleteRide}
			disabled={isLoadingDelete}
		>
			{#if isLoadingDelete}
				<span class="loading loading-spinner loading-xs" />
			{/if}
			Delete
		</button>
	</label>
</label>

<style>
	.tooltip:before {
		left: auto;
	}
</style>
