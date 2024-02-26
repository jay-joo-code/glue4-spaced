<script lang="ts">
	import { Html, Link, Preview, Text } from 'svelte-email';

	export let requestorName = '';
	export let bookingId = '';
</script>

<Html lang="en">
	<Preview preview="{requestorName} has made a ride reservation" />
	<Text>
		{requestorName} has made a ride reservation.
	</Text>
	<Text>
		Approve or decline the reservation through the
		<Link href="https://www.revycarpool.com/chatrooms/{bookingId}">REVY chatroom</Link>
	</Text>
</Html>
