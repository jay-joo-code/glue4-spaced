<script>
	import { page } from '$app/stores';
	import Aside from '$lib/components/glue/Aside.svelte';
	// import ChatPanel from '$lib/components/glue/chat/ChatPanel.svelte';
	// import MyChatroomList from '$lib/components/glue/chat/MyChatroomList.svelte';
	import Main from '$lib/components/glue/Main.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
</script>

<PageContainer title="Chatroom" layout="aside-main">
	<!-- <Aside>
		<div class="hidden md:block">
			<MyChatroomList activeChatroomId={chatroomId} />
		</div>
	</Aside>
	<Main>
		<ChatPanel {chatroom} />
	</Main> -->
</PageContainer>
