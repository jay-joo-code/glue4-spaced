<script lang="ts">
	import IconRightArrowLong from '$lib/icons/glue/IconRightArrowLong.svelte';
	import RadialGradient from './RadialGradient.svelte';

	export let heroTopLine: string = 'Job referrals';
	export let heroBottomLine: string = 'in 3 clicks';
	export let desc: string =
		'Give or receive job referrals quickly and efficiently to streamline your recruiting process.';
	export let linkLabel: string = 'Get started';
	export let linkHref: string = '';

	const OUTER_CIRCLES = [
		{
			src: 'https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofile-9.6770df3a.png&w=96&q=75',
			style: '--rotation:315deg',
			width: '32',
			height: '32'
		},
		{
			src: 'https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofile-8.6ba56773.png&w=96&q=75',
			style: '--rotation:230deg',
			width: '40',
			height: '40'
		},
		{
			src: 'https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofile-5.f106484f.png&w=48&q=75',
			style: '--rotation:70deg',
			width: '24',
			height: '24'
		}
	];

	const MIDDLE_CIRCLES = [
		{
			src: 'https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofile-11.b6e3fc09.png&w=64&q=75',
			style: '--rotation:45deg',
			width: '32',
			height: '32'
		},
		{
			src: 'https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofile-1.94662c21.png&w=64&q=75',
			style: '--rotation:205deg',
			width: '28',
			height: '28'
		},
		{
			src: 'https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofile-7.88bc7254.png&w=64&q=75',
			style: '--rotation:140deg',
			width: '42',
			height: '42'
		},
		{
			src: 'https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofile-10.64a671db.png&w=64&q=75',
			style: '--rotation:320deg',
			width: '38',
			height: '38'
		},
		{
			src: 'https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofile-2.b2bfbe92.png&w=48&q=75',
			style: '--rotation:270deg',
			width: '28',
			height: '28'
		}
	];

	const INNER_CIRCLES = [
		{
			src: 'https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofile-3.c948ec55.png&w=48&q=75',
			style: '--rotation:25deg',
			width: '21',
			height: '21'
		},
		{
			src: 'https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofile-4.3d2254e0.png&w=48&q=75',
			style: '--rotation:240deg',
			width: '24',
			height: '24'
		},
		{
			src: 'https://www.raycast.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fprofile-2.b2bfbe92.png&w=48&q=75',
			style: '--rotation:120deg',
			width: '28',
			height: '28'
		}
	];
</script>

<div class="relative w-full max-w-full overflow-hidden pb-24">
	<div class="relative flex  min-h-[80vh] w-full scale-75 items-center justify-center md:scale-100">
		<!-- content -->
		<div class="">
			<h2 class="text-gradient whitespace-nowrap text-center text-6xl font-extrabold">
				{heroTopLine}
			</h2>
			<h2 class="text-gradient mt-3 whitespace-nowrap text-center text-6xl font-extrabold">
				{heroBottomLine}
			</h2>
			<p
				class="mt-8 max-w-md text-center text-xl font-normal leading-relaxed text-base-content/70 md:text-lg">
				{desc}
			</p>
			<div class="relative z-20 mt-10 flex justify-center">
				<a href={linkHref}>
					<button class="btn-secondary btn gap-2">
						{linkLabel}
						<span class="text-xl"><IconRightArrowLong /></span>
					</button>
				</a>
			</div>
		</div>

		<!-- background gradient -->
		<RadialGradient placement="middle" size="xl" />

		<!-- rotating circles -->
		<div class="absolute inset-0 z-10">
			<div class="absolute inset-0">
				<!-- radial dotted lines: dark mode -->
				<div class="light:hidden">
					<div
						class="radial-dotted-lines h-[764px] w-[764px] rounded-full border-2 border-dashed border-base-content/[.03]" />
				</div>
				<div class="light:hidden">
					<div
						class="radial-dotted-lines h-[924px] w-[924px] rounded-full border-2 border-dashed border-base-content/[.03]" />
				</div>
				<div class="light:hidden">
					<div
						class="radial-dotted-lines h-[604px] w-[604px] rounded-full border-2 border-dashed border-base-content/[.03]" />
				</div>

				<!-- radial dotted lines: light mode -->
				<div class="dark:hidden">
					<div
						class="radial-dotted-lines h-[764px] w-[764px] rounded-full border-2 border-dashed border-base-content/[.03]" />
				</div>
				<div class="dark:hidden">
					<div
						class="radial-dotted-lines h-[924px] w-[924px] rounded-full border-2 border-dashed border-base-content/[.03]" />
				</div>
				<div class="dark:hidden">
					<div
						class="radial-dotted-lines h-[604px] w-[604px] rounded-full border-2 border-dashed border-base-content/[.03]" />
				</div>
			</div>

			<!-- rotating circles -->
			<div class="">
				{#each OUTER_CIRCLES as { src, style, width, height }}
					<!-- circle wrapper -->
					<div class="circle-wrapper circle-wrapper-left outer-circle hidden md:block" {style}>
						<!-- circle -->
						<div class="circle circle-left">
							<img {width} {height} {src} />
						</div>
					</div>
				{/each}

				{#each MIDDLE_CIRCLES as { src, style, width, height }}
					<!-- circle wrapper -->
					<div class="circle-wrapper circle-wrapper-right middle-circle" {style}>
						<!-- circle -->
						<div class="circle circle-right">
							<img {width} {height} {src} />
						</div>
					</div>
				{/each}

				{#each INNER_CIRCLES as { src, style, width, height }}
					<!-- circle wrapper -->
					<div class="circle-wrapper circle-wrapper-left inner-circle" {style}>
						<!-- circle -->
						<div class="circle circle-left">
							<img {width} {height} {src} />
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.radial-dotted-lines {
		position: absolute;
		top: 50%;
		left: 50%;
		pointer-events: none;
		transform: translate(-50%, -50%);
		display: block;
	}

	.outer-circle {
		width: 462px;
		--rotation: 145deg;
	}

	.middle-circle {
		width: 382px;
		--rotation: 275deg;
	}

	.inner-circle {
		width: 302px;
		--rotation: 25deg;
	}

	.circle-wrapper {
		--rotation-period: 180s;
		position: absolute;
		left: 50%;
		top: 50%;
		height: 0;
		transform-origin: 0 50%;
		transform: rotate(var(--rotation));
		will-change: transform;
	}

	.circle-wrapper-left {
		animation: rotate-left var(--rotation-period) linear infinite;
	}

	.circle-wrapper-right {
		animation: rotate-right var(--rotation-period) linear infinite;
	}

	.circle {
		position: absolute;
		top: 0;
		right: 0;
		will-change: transform;
		transform: translateY(-50%) translateX(50%) rotate(calc(var(--rotation) * -1));
		transform-origin: 50% 50%;
	}

	.circle-left {
		animation: compensate-rotation-left var(--rotation-period) linear infinite;
	}

	.circle-right {
		animation: compensate-rotation-right var(--rotation-period) linear infinite;
	}

	@keyframes rotate-right {
		0% {
			transform: rotate(var(--rotation));
		}

		to {
			transform: rotate(calc(var(--rotation) + 1turn));
		}
	}

	@keyframes rotate-left {
		0% {
			transform: rotate(var(--rotation));
		}

		to {
			transform: rotate(calc(var(--rotation) - 1turn));
		}
	}

	@keyframes compensate-rotation-right {
		0% {
			transform: translateY(-50%) translateX(50%) rotate(calc(var(--rotation) * -1));
		}

		to {
			transform: translateY(-50%) translateX(50%) rotate(calc(var(--rotation) * -1 - 1turn));
		}
	}

	@keyframes compensate-rotation-left {
		0% {
			transform: translateY(-50%) translateX(50%) rotate(calc(var(--rotation) * -1));
		}

		to {
			transform: translateY(-50%) translateX(50%) rotate(calc(var(--rotation) * -1 + 1turn));
		}
	}
</style>
