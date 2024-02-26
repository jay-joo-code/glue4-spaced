<script lang="ts">
	import { page } from '$app/stores';
	import Aside from '$lib/components/glue/Aside.svelte';
	import ChatPanel from '$lib/components/glue/chat/ChatPanel.svelte';
	import MyChatroomList from '$lib/components/glue/chat/MyChatroomList.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';

	$: ({ booking } = $page?.data);
	$: bookingId = $page?.url.pathname?.split('/')[2];
</script>

<PageContainer title="Chatroom" layout="aside-main">
	<Aside>
		<div class="{bookingId === 'list' ? 'block' : 'hidden'} md:!block">
			<MyChatroomList />
		</div>
	</Aside>
	<Main>
		{#if bookingId !== 'list'}
			{#await booking}
				<div class="flex h-[70vh] w-full items-center justify-center">
					<span class="loading loading-spinner" />
				</div>
			{:then booking}
				<ChatPanel {booking} />
			{/await}
		{/if}
	</Main>
</PageContainer>
