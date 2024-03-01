<script>
	import IconRightArrowLong from '$lib/icons/glue/IconRightArrowLong.svelte';
	import RadialGradient from './RadialGradient.svelte';

	export let heroTopLine = 'The thoughtful way';
	export let heroBottomLine = 'to find a time to meet';
	export let descTopLine =
		'You’ll love it for the advanced features to keep you in control of your calendar.';
	export let descBottomLine = '';
	export let href = '';
</script>

<div class="relative mx-auto w-full">
	<div class="bg-beams absolute inset-0 bottom-10 z-0 bg-bottom bg-no-repeat opacity-70" />
	<div class="hidden md:block">
		<RadialGradient placement="left" />
	</div>
	<div class="relative z-10 px-6 py-16 lg:py-28">
		<h2
			class="tracking-snug text-center text-4xl font-black leading-tight sm:text-5xl sm:leading-snug md:text-6xl md:leading-snug lg:text-7xl lg:leading-tight">
			<span>{heroTopLine}</span>
			<br class="hidden sm:block" />
			<span class="text-gradient">{heroBottomLine}</span>
		</h2>
		<p
			class="text-md mt-6 text-center leading-normal text-base-content/70 sm:text-lg md:text-xl md:leading-normal lg:text-xl lg:leading-9 lg:tracking-tight">
			<span>{descTopLine}</span>
			{#if descBottomLine}
				<br class="hidden md:block" />
				<span>{descBottomLine}</span>
			{/if}
		</p>
		{#if href}
			<div class="mt-8 flex justify-center">
				<a {href}>
					<button class="btn-primary btn gap-2 rounded-full px-10 pr-8">
						Get started
						<span class="text-2xl"><IconRightArrowLong /></span>
					</button>
				</a>
			</div>
		{/if}
	</div>
</div>
