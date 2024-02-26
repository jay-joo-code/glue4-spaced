<script lang="ts">
	import { currentUser } from '$lib/glue/pocketbase';
	import RideFormButtonModal from './RideFormButtonModal.svelte';
	import RequireAuthButton from './glue/RequireAuthButton.svelte';
</script>

{#if $currentUser}
	<RideFormButtonModal>Post a ride</RideFormButtonModal>
{:else}
	<RequireAuthButton class="btn-primary btn-sm btn md:btn-md">Post a Ride</RequireAuthButton>
{/if}
