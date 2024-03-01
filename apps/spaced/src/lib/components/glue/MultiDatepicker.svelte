<script>
	import { addDays, format, set, startOfWeek } from 'date-fns';

	export let selectedDates = [];

	let numberOfDays = 28;

	function splitArrayIntoChunks(arr, chunkSize) {
		const chunks = [];

		for (let i = 0; i < arr.length; i += chunkSize) {
			const chunk = arr.slice(i, i + chunkSize);
			chunks.push(chunk);
		}

		return chunks;
	}

	const startMonday = startOfWeek(new Date(), { weekStartsOn: 1 });
	const resetTime = (date) =>
		set(date, {
			hours: 0,
			minutes: 0,
			seconds: 0,
			milliseconds: 0
		});
	const allDates = Array.from({ length: numberOfDays }, (_, i) =>
		resetTime(addDays(startMonday, i))
	);
	const dates = splitArrayIntoChunks(allDates, 7);

	const toggle = (date) => {
		if (selectedDates?.includes(date)) {
			selectedDates = selectedDates.filter((d) => d !== date);
		} else {
			selectedDates = [...selectedDates, date];
		}
	};
	const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
	const today = resetTime(new Date());
</script>

<div class="{$$props.class} space-y-1">
	<div class="ml-[2.4rem] flex space-x-1">
		{#each dayLabels as label}
			<div class="w-[2rem] text-xs font-medium text-base-content/80">
				{label}
			</div>
		{/each}
	</div>
	{#each dates as dateRow}
		<div class="flex items-center space-x-1">
			<!-- month label -->
			<p class="mt-0.5 mr-0.5 text-xs text-base-content/80">{format(dateRow[6], 'MMM')}</p>
			{#each dateRow as date}
				<button
					type="button"
					class=" h-[2rem] w-[2rem] rounded-md text-xs {selectedDates?.includes(date)
						? 'bg-primary'
						: 'bg-base-200'} {today.toISOString() === date.toISOString()
						? 'border border-base-content/40'
						: ''}"
					on:click={() => {
						toggle(date);
					}}
				>
					{format(date, 'd')}
				</button>
			{/each}
		</div>
	{/each}
</div>
