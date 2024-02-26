<script lang="ts">
	import IconRightArrowLong from '$lib/icons/glue/IconRightArrowLong.svelte';
	import { format } from 'date-fns';
	import UserAvatar from './UserAvatar.svelte';
	import StartDriveButtonModal from './StartDriveButtonModal.svelte';

	export let waitlist = null;
	export let originName;
	export let destinationName;

	let dialog;
</script>

{#if waitlist && originName && destinationName}
	<button
		class="btn-ghost btn mt-3 flex items-center"
		on:click={() => {
			dialog?.showModal();
		}}
	>
		<div class="avatar-group -space-x-4">
			{#each waitlist?.slice(-3) as waitlistItem}
				<div class="avatar">
					<div class="w-6">
						<img src={waitlistItem?.expand?.user.avatarUrl} />
					</div>
				</div>
			{/each}
		</div>
		<p class="text-xs text-base-content/80">
			{waitlist?.length} requests for this route
		</p>
	</button>

	<dialog bind:this={dialog} class="modal">
		<div class="modal-box relative box-border h-[70vh]">
			<div class="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
				<div class="">
					<h2 class="text-lg font-semibold text-base-content/70">Requests for</h2>
					<h2 class="text-2xl font-semibold">
						{originName}
						<span class="mt-1 inline text-3xl [&_svg]:inline">
							<IconRightArrowLong />
						</span>
						{destinationName}
					</h2>
				</div>
				<button class="mt-6 sm:mt-0">
					<StartDriveButtonModal />
				</button>
			</div>

			<div class="my-8 w-full border-t border-base-content/10" />

			<div class="flex items-center justify-between">
				<p class="text-sm font-medium text-base-content/70">Name</p>
				<p class="text-sm font-medium text-base-content/70">Requested date</p>
			</div>
			<div class="">
				{#each waitlist as waitlistItem}
					<div class="my-8 flex items-center justify-between">
						<UserAvatar user={waitlistItem?.expand?.user} />
						<p class="font-medium">
							{format(new Date(waitlistItem?.date), 'dd LLL')}
							<span class="hidden sm:inline-block">
								{format(new Date(waitlistItem?.date), 'yyyy')}
							</span>
						</p>
					</div>
				{/each}
			</div>
		</div>

		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
{/if}
