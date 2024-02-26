<script lang="ts">
	import { PLACES } from '$lib/util/constants';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import TextInput from './glue/TextInput.svelte';
	interface $$Props extends HTMLInputAttributes {
		label?: string;
		name?: string;
		error?: string;
	}
	export let label: string = '';
	export let value: string = '';
	export let error: string = '';

	let isSuggestionOpen = false;

	$: suggestions = PLACES?.filter((place) => place?.includes(value?.trim()?.toLowerCase()));
</script>

<div class="">
	<div class="dropdown {isSuggestionOpen ? 'dropdown-open' : ''}">
		<TextInput
			bind:value
			{label}
			{error}
			on:focus={() => {
				isSuggestionOpen = true;
			}}
			on:blur={() => {
				isSuggestionOpen = false;
			}}
		/>
		{#if !PLACES?.includes(value)}
			<ul class="dropdown-content menu rounded-box menu-compact mt-2 w-full bg-base-200 p-2 shadow">
				{#if suggestions && suggestions?.length > 0}
					{#each suggestions?.slice(0, 4) as suggestion}
						<li
							class="my-0 w-full"
							on:mousedown={() => {
								value = suggestion;
								isSuggestionOpen = false;
							}}
						>
							<span class="w-full truncate text-sm text-base-content/70 line-clamp-1"
								>{suggestion}</span
							>
						</li>
					{/each}
				{/if}
			</ul>
		{/if}
	</div>
</div>
