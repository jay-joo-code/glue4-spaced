<script lang="ts">
	import IconRightArrowLong from '$lib/icons/glue/IconRightArrowLong.svelte';
	import RadialGradient from './RadialGradient.svelte';

	export let overline: string = 'Our mission';
	export let heading: string = 'Give your schedulers a calendar not a list';
	export let desc: string =
		'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Atque, eos iusto perferendis eaque sunt dolores aliquam beatae consequuntur saepe commodi.';
	export let linkLabel: string = '';
	export let linkHref: string = '';
</script>

<section class="relative min-h-[60vh] overflow-hidden px-8 py-16 text-center md:pt-48">
	<RadialGradient />
	<p class="text-lg font-bold text-primary">{overline}</p>
	<div class="flex justify-center">
		<h2 class="mt-4 max-w-3xl text-4xl font-extrabold !leading-snug tracking-tight sm:text-5xl">
			{heading}
		</h2>
	</div>
	{#if desc}
		<p
			class="text-md mx-auto mt-10 max-w-xl font-normal leading-relaxed text-base-content/70 md:text-lg">
			{desc}
		</p>
	{/if}
	{#if linkLabel}
		<a class="btn-primary btn mt-10 gap-1" href={linkHref}>
			{linkLabel}
			<span class="text-xl"><IconRightArrowLong /></span>
		</a>
	{/if}
</section>
