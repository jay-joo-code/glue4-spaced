<script lang="ts">
	import { browser } from '$app/environment';
	import { currentUser } from '$lib/glue/pocketbase';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface $$Props extends HTMLButtonAttributes {
		href?: string;
	}

	export let href: string = '';
</script>

{#if $currentUser}
	{#if href}
		<a {href}>
			<button on:click {...$$restProps} class={$$props.class}>
				<slot />
			</button>
		</a>
	{:else}
		<button on:click {...$$restProps} class={$$props.class}>
			<slot />
		</button>
	{/if}
{:else if browser && navigator.userAgent.includes('Instagram')}
	<label for="modal-force-browser-instagram" class={$$props.class}>
		<slot />
	</label>
{:else}
	<label for="modal-auth" class={$$props.class}>
		<slot />
	</label>
{/if}
