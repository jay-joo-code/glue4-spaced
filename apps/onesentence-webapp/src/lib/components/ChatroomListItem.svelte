<script lang="ts">
	import { page } from '$app/stores';
	import { currentUser } from '$lib/glue/pocketbase';
	import IconRightArrowLong from '$lib/icons/glue/IconRightArrowLong.svelte';

	export let booking;

	$: activeChatroomId = $page?.url?.pathname?.split('/')[2];
	$: otherUser =
		booking?.driver === $currentUser?.id ? booking?.expand?.requestor : booking?.expand?.driver;
</script>

<div class="max-w-full">
	<a href={`/chatrooms/${booking?.id}`}>
		<div
			class={`border-b border-base-content/20 px-4 pt-4 pb-6 ${
				activeChatroomId === booking?.id && 'bg-base-300'
			}`}
		>
			<!-- origin, destination -->
			<div class="inline-block rounded bg-base-200 px-2">
				<div class="flex items-center">
					<p class="text-xs font-medium">{booking?.expand?.ride?.expand?.origin?.name}</p>
					<span class="mx-1 mb-0.5 text-lg [&_svg]:inline">
						<IconRightArrowLong />
					</span>
					<p class="text-xs font-medium">
						{booking?.expand?.ride?.expand?.destination?.name}
					</p>
				</div>
			</div>

			<div class="mt-3 flex items-center space-x-3">
				<!-- avatar -->
				<div class="avatar">
					<div class="w-10 rounded-full">
						<img src={otherUser?.avatarUrl} />
					</div>
				</div>

				<div class="space-y-0.5 overflow-hidden">
					<!-- other user name -->
					<div class="flex items-center">
						<p class="truncate text-sm font-medium">
							{otherUser?.name}
						</p>
					</div>

					<!-- latest chat -->
					<p class="truncate text-xs text-base-content/80">
						{booking?.state}
					</p>
				</div>
			</div>
		</div>
	</a>
</div>
