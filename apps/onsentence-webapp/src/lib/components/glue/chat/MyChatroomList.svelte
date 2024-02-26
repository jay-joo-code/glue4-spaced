<script lang="ts">
	import { page } from '$app/stores';
	import ChatroomListItem from '$lib/components/ChatroomListItem.svelte';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import { onDestroy, onMount } from 'svelte';

	let unsubscribe: () => void;

	$: ({ bookings } = $page?.data);

	const subscribeToChats = async () => {
		try {
			unsubscribe = await pb.collection('chats').subscribe('*', async ({ action, record }) => {
				if (
					action === 'create' &&
					(record?.sender === $currentUser?.id || record?.receiver === $currentUser?.id)
				) {
					// TODO: handle change seen state
				}
			});
		} catch (error) {}
	};

	onMount(async () => {
		subscribeToChats();
	});

	onDestroy(() => {
		unsubscribe?.();
	});
</script>

<div class="rounded-xl border-base-content/20 md:h-[80vh] md:overflow-auto md:border">
	<div class="mb-3 px-4 md:mt-6 md:px-6">
		<p class="text-2xl font-semibold">Messages</p>
		<p class="mt-4 text-sm text-base-content/70 md:text-xs">
			You'll receive an email notification when someone messages you!
		</p>
	</div>
	<div>
		{#await bookings}
			<!-- loading state -->
			<div class="mt-8 flex justify-center">
				<span class="loading loading-spinner loading-sm" />
			</div>
		{:then bookings}
			{#if bookings?.length > 0}
				<!-- chatroom list -->
				<div class="mt-1">
					{#each bookings as booking (booking?.id)}
						<ChatroomListItem {booking} />
					{/each}
				</div>
			{:else}
				<!-- empty state -->
				<div class="mt-8 flex w-full justify-center px-3">
					<div class="flex w-full items-center justify-center rounded-xl bg-base-200 py-4">
						<div class="w-4/6">
							<p class="text-md font-semibold">No messages yet!</p>
							<p class="mt-2 text-sm text-base-content/70">Send messages to see your them here</p>
						</div>
					</div>
				</div>
			{/if}
		{/await}
	</div>
</div>
