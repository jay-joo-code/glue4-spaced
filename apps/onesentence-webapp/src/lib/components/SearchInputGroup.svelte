<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import DatePicker from '$lib/components/glue/DatePicker.svelte';
	import { format } from 'date-fns';

	let origin = $page.url.searchParams.get('origin');
	let destination = $page.url.searchParams.get('destination');
	let paramDate = $page.url.searchParams.get('date');
	let date = paramDate ? new Date(paramDate) : null;
	let error: string;
	let isExpanded = false;

	$: ({ locations } = $page?.data);
	$: originName = locations?.find((location) => location.id === origin)?.name;
	$: destinationName = locations?.find((location) => location.id === destination)?.name;

	const handleSearch = async () => {
		if (!origin || !destination || !date) {
			error = 'Please input all of your travel details';
		} else {
			const query = {
				origin,
				destination,
				date: date.toISOString()
			};
			isExpanded = false;
			goto(`/search?${new URLSearchParams(query).toString()}`);
		}
	};
</script>

{#if locations}
	<div class="flex w-full flex-col items-center">
		{#if $page.url.pathname === '/search' && !isExpanded}
			<!-- mobile: search inputs, collapsed state -->
			<div class="flex w-full items-center justify-between md:hidden">
				<div class="">
					<p class="font-medium">{originName} to {destinationName}</p>
					{#if date}
						<p class="mt-1 text-xs text-base-content/80">{format(date, 'iii, dd MMMM yyyy')}</p>
					{/if}
				</div>
				<button
					class="link-primary link"
					on:click={() => {
						isExpanded = true;
					}}>Edit</button
				>
			</div>
		{:else}
			<!-- mobile: search inputs, expanded state -->
			<form class="w-full max-w-xs md:hidden" on:submit|preventDefault={handleSearch}>
				<div class="border-base-content/15 rounded-t-lg border py-1">
					<div class="border-base-content/15 flex w-full items-center border-b py-2">
						<select class="select w-full appearance-none" bind:value={origin}>
							<option disabled value={null}>Departing from</option>
							{#each locations as location}
								<option value={location.id}>{location.name}</option>
							{/each}
						</select>
					</div>
					<div class="border-base-content/15 flex w-full items-center border-b py-2">
						<select class="select w-full appearance-none" bind:value={destination}>
							<option disabled value={null}>Arriving at</option>
							{#each locations as location}
								<option value={location.id}>{location.name}</option>
							{/each}
						</select>
					</div>
					<div class="flex h-14 items-center justify-center rounded-t-none">
						<DatePicker bind:value={date} />
					</div>
				</div>
				<button
					class="btn-primary btn-block btn-sm btn flex h-16 items-center justify-center rounded-t-none"
					>Search</button
				>
			</form>
		{/if}

		<!-- desktop: search inputs -->
		<form
			class="w-140 hidden h-14 items-stretch md:flex md:justify-center"
			on:submit|preventDefault={handleSearch}
		>
			<div class="border-base-content/15 flex items-center gap-2 rounded-l-md border ">
				<select class="select w-full max-w-md pl-5" bind:value={origin}>
					<option disabled value={null}>Departing from</option>
					{#each locations as location}
						<option value={location.id}>{location.name}</option>
					{/each}
				</select>
				<div class="border-base-content/15 h-full border-l" />
				<select class="select w-full max-w-md pl-3" bind:value={destination}>
					<option disabled value={null}>Arriving at</option>
					{#each locations as location}
						<option value={location.id}>{location.name}</option>
					{/each}
				</select>
				<div class="h-full border-l" />
				<DatePicker bind:value={date} />
			</div>
			<button class="btn-primary btn h-full rounded-l-none px-8">Search</button>
		</form>

		<!-- form error -->
		{#if error}
			<p class="mt-6 text-xs text-error">{error}</p>
		{/if}
	</div>
{:else}
	<div class="flex w-full justify-center">
		<span class="loading loading-spinner loading-sm" />
	</div>
{/if}
