<script>
	import IconFolder from '$lib/icons/glue/IconFolder.svelte';
	import IconKey from '$lib/icons/glue/IconKey.svelte';

	export let heading = 'Build faster and focus on products';
	export let features = [
		{
			icon: IconFolder,
			title: 'Database',
			desc: "Every project is a full Postgres database, the world's most trusted relational database."
		},
		{
			icon: IconKey,
			title: 'Authentication',
			desc: "Every project is a full Postgres database, the world's most trusted relational database."
		},
		{
			icon: IconFolder,
			title: 'Database',
			desc: "Every project is a full Postgres database, the world's most trusted relational database."
		},
		{
			icon: IconFolder,
			title: 'Database',
			desc: "Every project is a full Postgres database, the world's most trusted relational database."
		}
	];
</script>

<div
	class="container relative mx-auto max-w-7xl space-y-16 px-6 py-16 pb-0 sm:py-18 md:py-24 lg:px-16 lg:py-24 xl:px-20">
	<h3 class="mt-4 text-4xl font-extrabold !leading-snug tracking-tight sm:text-5xl">
		{heading}
	</h3>
	<dl
		class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-2 md:gap-16 lg:grid-cols-4 lg:gap-x-8 xl:gap-x-8">
		{#each features as feature}
			<div class="mb-10 space-y-4 md:mb-0">
				<div class="flex items-center">
					<div
						class="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-base-100 ">
						<svelte:component this={feature?.icon} />
					</div>
					<dt class="text-scale-1200 ml-4 flex flex-row font-bold xl:flex-col">{feature?.title}</dt>
				</div>
				<p class="leading-relaxed text-base-content/70">
					{feature?.desc}
				</p>
			</div>
		{/each}
	</dl>
</div>
