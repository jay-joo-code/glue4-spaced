<script lang="ts">
	import type { HTMLSelectAttributes } from 'svelte/elements';
	interface $$Props extends HTMLSelectAttributes {
		label?: string;
		error?: string;
		placeholder?: string;
		options: { value: string; label: string }[];
	}
	export let label: string = '';
	export let value: string = '';
	export let placeholder: string = '';
	export let error: string = '';
	export let options: { value: string; label: string }[] = [];
</script>

<div class="form-control w-full">
	{#if label}
		<label class="label">
			<span class="label-text text-base-content/80">{label}</span>
		</label>
	{/if}
	<select
		bind:value
		on:blur
		on:change
		on:click
		on:input
		on:contextmenu
		on:focus
		on:keydown
		on:keypress
		on:keyup
		on:mouseenter
		on:mouseleave
		on:mouseover
		on:paste
		{...$$restProps}
		class="{$$props.class} select-bordered select w-full max-w-xs {error && 'input-error'}">
		<option selected disabled>{placeholder}</option>
		{#each options as { value, label }}
			<option {value}>{label}</option>
		{/each}
	</select>
	{#if error}
		<label class="label">
			<span class="label-text-alt text-error">{error}</span>
		</label>
	{/if}
</div>
