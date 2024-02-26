<script lang="ts">
	import { Html, Link, Preview, Text } from 'svelte-email';

	export let senderName;
	export let chatContent;
	export let bookingId;
</script>

<Html lang="en">
	<Preview preview="{senderName} has sent you a new message" />
	<Text>
		{senderName} sent you a new message on REVY:
	</Text>
	<Text>
		"{chatContent}"
	</Text>
	<Text>
		Reply through the
		<Link href="https://www.revycarpool.com/chatrooms/{bookingId}">REVY chatroom</Link>
	</Text>
</Html>
