<script>
	import { APP_NAME } from '$lib/glue/config';
	import { format } from 'date-fns';

	const navs = [
		{
			heading: 'Product',
			links: [
				{ label: 'Home', href: '/' },
				{ label: 'Database', href: '/database' },
				{ label: 'Calendar', href: '/calendar' }
			]
		},
		{
			heading: 'About',
			links: [
				{ label: 'About us', href: '/' },
				{ label: 'Team', href: '/database' },
				{ label: 'Join us', href: '/calendar' }
			]
		},
		{
			heading: 'Company',
			links: [
				{ label: 'Blog', href: '/' },
				{ label: 'Database', href: '/database' },
				{ label: 'Upcoming events', href: '/calendar' }
			]
		}
	];
</script>

<footer class="flex justify-center border-t border-base-content/10" aria-labelledby="footerHeading">
	<h2 id="footerHeading" class="sr-only">Footer</h2>
	<div class="relative mx-auto w-full max-w-6xl px-6 py-16 sm:py-18 md:py-24 lg:py-24">
		<div class="xl:grid xl:grid-cols-3 xl:gap-8">
			<div class="xl:col-span-1">
				<a class="text-3xl font-bold text-base-content/70" href="/">{APP_NAME}</a>
				<p class="mt-4 text-xs font-medium text-base-content/60">
					{APP_NAME} ©
					{format(new Date(), 'yyyy')}
				</p>
			</div>
			<div class="mt-12 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
				<div class="grid grid-cols-2 gap-8 md:grid-cols-4">
					{#each navs as nav}
						<div>
							<h6 class="ml-1 text-lg font-bold text-base-content/80">{nav?.heading}</h6>
							<ul class="mt-4 space-y-1">
								{#each nav.links as link}
									<li>
										<a
											href={link.href}
											class="btn-ghost btn-sm btn px-1 font-medium text-base-content/60">
											{link.label}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</footer>
