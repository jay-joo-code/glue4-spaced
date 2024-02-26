<script lang="ts">
	import RideItem from '$lib/components/RideItem.svelte';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import { format } from 'date-fns';
	import { onDestroy, onMount } from 'svelte';
	import IconBack from '$lib/icons/glue/IconBack.svelte';
	import TextInput from '../TextInput.svelte';
	import IconRightArrowLong from '$lib/icons/glue/IconRightArrowLong.svelte';
	import IconDownKarat from '$lib/icons/glue/IconDownKarat.svelte';
	import { invalidateAll } from '$app/navigation';

	export let booking;

	let chatGroups = [];
	let content = '';
	let prevChatUser = null;
	let prevDateString = null;
	let innerWidth = 0;
	let isRideItemExpanded = false;
	let isLoadingStateChange = false;

	$: otherUser =
		booking?.driver === $currentUser?.id ? booking?.expand?.requestor : booking?.expand?.driver;

	const appendChat = (chat) => {
		const chatDateString = format(new Date(chat?.created), 'MMM dd');

		if (chatGroups?.length === 0 || !prevChatUser || prevDateString !== chatDateString) {
			// first chat group || new date, new chat group
			chatGroups?.push({
				id: chatDateString,
				variant: 'datestamp',
				content: chatDateString
			});
			chatGroups?.push({
				...chat,
				items: [chat]
			});
		} else if (prevChatUser !== chat?.sender) {
			// non-consecutive sender, new chat group
			chatGroups?.push({
				...chat,
				items: [chat]
			});
		} else {
			// consecutive sender, append to group
			chatGroups[chatGroups?.length - 1]?.items?.push(chat);
			chatGroups[chatGroups?.length - 1].id = chat?.id; // update group id to force rerender
		}

		chatGroups = [...chatGroups];
		prevChatUser = chat?.sender;
		prevDateString = chatDateString;
	};

	const fetchChats = async () => {
		try {
			const chatDocs = await pb.collection('chats').getFullList(200, {
				filter: `booking="${booking?.id}"`,
				sort: 'created',
				expand: 'sender,receiver'
			});

			chatDocs?.forEach((chat) => {
				appendChat(chat);
			});
		} catch (error) {}
	};

	$: if (booking) {
		chatGroups = [];
		fetchChats();
	}

	const handleSendChat = async () => {
		try {
			const chatContent = content;

			// reset input value immediately to make it feel more responsive
			content = '';

			const newChat = await pb.collection('chats').create({
				variant: 'text',
				content: chatContent,
				booking: booking?.id,
				sender: $currentUser?.id,
				receiver: otherUser?.id
			});
			appendChat(newChat);

			await fetch('/api/email', {
				method: 'POST',
				body: JSON.stringify({
					variant: 'CHAT_MESSAGE',
					receiverId: otherUser?.id,
					templateProps: {
						senderName: $currentUser?.name,
						chatContent,
						bookingId: booking?.id
					}
				}),
				headers: {
					'content-type': 'application/json'
				}
			});
		} catch (error) {}
	};

	const subscribeToChats = async () => {
		try {
			pb.collection('chats').subscribe('*', async ({ action, record }) => {
				if (record?.booking === booking?.id && action === 'create') {
					// TODO: fix subscriptions sometimes not working
					// appendChat(record);
				}
			});
		} catch (error) {}
	};

	const chatGroupName = (group) => {
		return group?.sender === booking?.driver
			? booking?.expand?.driver?.name
			: booking?.expand?.requestor?.name;
	};

	const handleChangeBookingState = async (newState: 'APPROVED' | 'DECLINED') => {
		isLoadingStateChange = true;
		try {
			await pb.collection('bookings').update(booking?.id, {
				state: newState
			});
			await invalidateAll();
			await fetch('/api/email', {
				method: 'POST',
				body: JSON.stringify({
					variant: 'BOOKING_STATE_CHANGE',
					receiverId: booking?.requestor,
					templateProps: {
						driverName: booking?.expand?.ride?.expand?.driver?.name,
						newState: newState?.toLowerCase(),
						bookingId: booking?.id
					}
				}),
				headers: {
					'content-type': 'application/json'
				}
			});
		} catch (error) {}
		isLoadingStateChange = false;
	};

	onMount(() => {
		subscribeToChats();
	});

	onDestroy(() => {
		pb.collection('chats').unsubscribe();
	});
</script>

<svelte:window bind:innerWidth />

<div
	class="grid-container h-[90vh] grid-cols-1 grid-rows-3 rounded md:h-[80vh]"
	style:grid-template-rows={isRideItemExpanded ? '6fr 5fr 1fr' : '2fr 7fr 1fr'}
>
	<!-- chat header -->
	<div class="">
		<div class="mb-6 md:hidden">
			<a href="/chatrooms/list">
				<button class="btn-neutral btn-sm btn">
					<IconBack />
					Back
				</button>
			</a>
		</div>

		<div class="flex items-center">
			<div class="avatar">
				<div
					class="h-10 w-10 rounded-full ring-1 ring-base-content/20 ring-offset-1 ring-offset-base-100"
				>
					<img src={otherUser?.avatarUrl} />
				</div>
			</div>
			<p class="ml-4 font-medium">{otherUser?.name}</p>
		</div>

		<!-- ride info -->
		<div class="mt-6">
			{#if isRideItemExpanded}
				<RideItem
					ride={booking?.expand?.ride}
					{booking}
					onCardCollapse={() => {
						isRideItemExpanded = false;
					}}
				/>
			{:else}
				<button
					class="pb flex w-full items-center justify-between rounded-xl border border-base-content/20 px-4 pt-1 pb-3 hover:bg-base-200 md:px-6"
					on:click={() => {
						isRideItemExpanded = true;
					}}
				>
					<p class="break-all text-lg font-bold">
						{booking?.expand?.ride?.expand?.origin?.name}
						<span class="mt-1 inline text-2xl [&_svg]:inline">
							<IconRightArrowLong />
						</span>
						{booking?.expand?.ride?.expand?.destination?.name}
					</p>
					<div class="pt-2 text-3xl">
						<IconDownKarat />
					</div>
				</button>
			{/if}
		</div>

		<!-- ride status -->
		<div class="flex h-[3rem] items-center border-b border-base-content/20 px-2 md:h-[4rem]">
			<!-- state: loading -->
			{#if isLoadingStateChange}
				<span class="loading loading-spinner loading-sm" />

				<!-- state: pending -->
			{:else if booking?.state === 'PENDING'}
				{#if booking?.driver === $currentUser?.id}
					<div class="flex items-center py-6">
						<button
							class="btn-success btn"
							on:click={() => {
								handleChangeBookingState('APPROVED');
							}}>Approve</button
						>
						<button
							class="btn-error btn ml-4"
							on:click={() => {
								handleChangeBookingState('DECLINED');
							}}>Decline</button
						>
					</div>
				{:else}
					<p class="text-sm font-medium text-base-content/80">
						Status:
						<span class="font-semibold text-base-content">Pending</span>
					</p>
				{/if}

				<!-- state: approved -->
			{:else if booking?.state === 'APPROVED'}
				<div class="flex w-full items-center justify-between">
					<p class="text-sm font-medium text-base-content/80">
						Status:
						<span class="font-semibold text-success">Approved</span>
					</p>

					{#if booking?.driver === $currentUser?.id}
						<button
							class="btn-outline btn-sm btn"
							on:click={() => {
								handleChangeBookingState('DECLINED');
							}}>Cancel approval</button
						>
					{/if}
				</div>

				<!-- state: declined -->
			{:else if booking?.state === 'DECLINED'}
				<div class="flex w-full items-center justify-between">
					<p class="text-sm font-medium text-base-content/80">
						Status:
						<span class="font-semibold text-error">Declined</span>
					</p>

					{#if booking?.driver === $currentUser?.id}
						<button
							class="btn-outline btn-sm btn"
							on:click={() => {
								handleChangeBookingState('APPROVED');
							}}>Approve request</button
						>
					{/if}
				</div>
			{/if}
		</div>
	</div>

	<!-- chat content -->
	<div
		class="flex flex-1 snap-y snap-proximity flex-col-reverse overflow-y-auto pr-1 [&>div>div:last-child]:snap-end"
	>
		<div class="">
			{#if booking}
				{#each chatGroups as group (group?.id)}
					{#if group?.variant === 'datestamp'}
						<div class="divider mt-4 mb-3 text-sm">{group?.content}</div>
					{:else}
						<div class={`chat ${group?.sender === $currentUser?.id ? 'chat-end' : 'chat-start'}`}>
							<div class="chat-header mb-2">
								{chatGroupName(group)}
								<time class="ml-1 text-xs opacity-50"
									>{format(new Date(group?.created), 'hh:mm aaa')}</time
								>
							</div>
							{#each group?.items as item (item?.id)}
								<div class="chat-bubble mb-2">{item?.content}</div>
							{/each}
						</div>
					{/if}
				{/each}
			{/if}
		</div>
	</div>

	<!-- chat input -->
	<div class="flex w-full items-end">
		<form on:submit|preventDefault={handleSendChat} class="flex w-full items-center">
			<TextInput
				bind:value={content}
				class="input rounded-full border-base-content/40"
				placeholder="Type a message"
				autofocus={innerWidth >= 768 || undefined}
			/>
			<button class="btn-primary btn-md btn ml-3 rounded-full">Send</button>
		</form>
	</div>
</div>

<style>
	.grid-container {
		display: grid;
		grid-template-columns: 1fr;
		grid-column-gap: 0px;
		grid-row-gap: 0px;
	}
</style>
