<script lang="ts">
	import { Button, Html, Link, Preview, Text } from 'svelte-email';

	export let driverName = '';
	export let newState = '';
	export let bookingId = '';
</script>

<Html lang="en">
	<Preview preview="{driverName} has {newState} your ride reservation" />
	<Text>
		{driverName} has {newState} your ride reservation
	</Text>
	<Text>
		Contact the driver through the
		<Link href="https://www.revycarpool.com/chatrooms/{bookingId}">REVY chatroom</Link>
	</Text>
</Html>
