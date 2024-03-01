<script lang="ts">
	import IconRightArrowLong from '$lib/icons/glue/IconRightArrowLong.svelte';

	export let overline: string = 'Contraint-based';
	export let heading: string = 'Give your schedulers a calendar, not a list.';
	export let desc: string =
		'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quibusdam pariatur sapiente earum nulla? Ducimus sapiente, vero quaerat iste nisi quibusdam.';
	export let photoPath: string =
		'https://savvycal.com/assets/overlay-ba9b3f5c11d50943e3078430f274c03b.png?vsn=d';
	export let isReversed: boolean = false;
	export let linkLabel: string = '';
	export let linkHref: string = '';
</script>

<div
	class="mx-auto max-w-6xl items-center justify-center px-8 pt-18 md:flex md:pt-36 {isReversed &&
		'flex-row-reverse'}">
	<div class="md:w-1/2 {isReversed ? 'md:pl-20' : 'md:pr-20'}">
		<h2 class="mt-8 font-semibold text-primary">{overline}</h2>
		<h2 class="mt-4 text-3xl font-extrabold  tracking-tight sm:text-4xl sm:leading-snug">
			{heading}
		</h2>
		<p class="mt-4 max-w-3xl space-y-6 leading-relaxed text-base-content/70">
			{desc}
		</p>
		{#if linkLabel}
			<a
				class="btn-primary btn-sm btn mt-6 gap-1 rounded-full"
				href={linkHref}
				target="_blank"
				rel="noreferrer">
				{linkLabel}
				<span class="text-xl"><IconRightArrowLong /></span>
			</a>
		{/if}
	</div>
	<div class="relative mt-16 flex md:w-2/5">
		<div
			class="bg-gradient absolute inset-0 {isReversed
				? 'origin-bottom-left -rotate-3'
				: 'origin-bottom-right rotate-3'} transform rounded-lg" />
		<div class="z-10 rounded-lg shadow">
			<div class="overflow-hidden rounded-lg bg-white p-3 shadow-lg md:p-6">
				<img src={photoPath} width="1092" height="878" alt="Calendar overlay" loading="lazy" />
			</div>
		</div>
	</div>
</div>
