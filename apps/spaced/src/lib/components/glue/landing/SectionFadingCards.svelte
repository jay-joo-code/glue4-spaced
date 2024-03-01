<script lang="ts">
	import FadingCard from './FadingCard.svelte';

	export let enableShowMore: boolean = false;
	export let heading: string = 'Testimonials';
	export let cardCols = [
		[
			{
				heading: 'Cornell University',
				subheading: '24 guides',
				desc: 'Cornell University is a private research university that provides an exceptional education for undergraduates and graduate and professional students.',
				imagePath: '/logo-cornell.png'
			},
			{
				heading: 'Stanford University',
				subheading: '17 guides',
				desc: 'Stanford University is a prestigious private research institution located in Stanford, California. Founded in 1885 by Leland and Jane Stanford, it is renowned for its top-notch academic programs, cutting-edge research, and world-class faculty. ',
				imagePath: '/logo-stanford.jpg'
			}
		],
		[
			{
				heading: 'Yale University',
				subheading: '19 guides',
				desc: 'Yale University is a private Ivy League research university in New Haven, Connecticut. Founded in 1701, it is the third-oldest institution of higher education in the United States and one of the nine Colonial Colleges chartered before the American Revolution.',
				imagePath: '/logo-yale.png'
			},
			{
				heading: 'Princeton University',
				subheading: '15 guides',
				desc: 'Princeton University is a private Ivy League research university in Princeton, New Jersey. Founded in 1746 in Elizabeth as the College of New Jersey, Princeton is the fourth-oldest institution of higher education in the United States and one of the nine Colonial Colleges chartered before the American Revolution. ',
				imagePath: '/logo-princeton.png'
			}
		],
		[
			{
				heading: 'University of Pennsylvania',
				subheading: '21 guides',
				desc: 'The University of Pennsylvania is a private Ivy League research university located in Philadelphia, Pennsylvania. Founded in 1740, it is the fourth-oldest institution of higher education in the United States. ',
				imagePath: '/logo-penn.png'
			},
			{
				heading: 'Harvard University',
				subheading: '25 guides',
				desc: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Founded in 1636, it is the oldest institution of higher education in the United States and the first to be established in the New World.',
				imagePath: '/logo-harvard.jpg'
			}
		]
	];

	let isShowMore = false;
</script>

<section
	class="relative mx-auto mb-20 max-w-7xl px-4 pt-32 focus:outline-none sm:px-3 md:px-5 md:pt-48"
>
	<h2 class="mt-4 text-center text-4xl font-extrabold tracking-tight sm:text-5xl">{heading}</h2>
	<div
		class="mt-12 grid grid-cols-1 gap-6 overflow-hidden sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-8 {!isShowMore &&
			'max-h-[33rem]'}"
	>
		{#each cardCols as cards}
			<ul class="space-y-8">
				{#each cards as card}
					<FadingCard {card} />
				{/each}
			</ul>
		{/each}
	</div>
	<div
		class="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pt-96 pb-8 {!isShowMore &&
			'bg-gradient-to-t from-base-100'}"
	>
		{#if enableShowMore && !isShowMore}
			<button
				type="button"
				class="pointer-events-auto relative flex h-12 items-center rounded-lg bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:bg-slate-700 dark:hover:bg-slate-600"
				on:click={() => {
					isShowMore = true;
				}}>Show more</button
			>
		{/if}
	</div>
</section>
