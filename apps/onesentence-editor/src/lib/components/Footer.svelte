<script>
	import { APP_NAME, PRIVATE_NAVS, PUBLIC_NAVS } from '$lib/glue/config';
	import { currentUser } from '$lib/glue/pocketbase';
	import { format } from 'date-fns';

	const productNavGroup = {
		heading: 'Product',
		links: PUBLIC_NAVS?.map(({ label, path }) => ({
			label,
			href: path
		}))
	};
	const privateNavGroup = {
		heading: 'My pages',
		links: PRIVATE_NAVS?.map(({ label, path }) => ({
			label,
			href: path
		}))
	};

	$: navs = $currentUser ? [productNavGroup, privateNavGroup] : [productNavGroup];
</script>

<footer class="flex justify-center border-t border-base-content/10" aria-labelledby="footerHeading">
	<h2 id="footerHeading" class="sr-only">Footer</h2>
	<div class="sm:py-18 relative mx-auto w-full max-w-4xl px-4 py-16 md:py-24 lg:py-24">
		<div class="xl:grid xl:grid-cols-3 xl:gap-8">
			<div class="xl:col-span-1">
				<a class="text-3xl font-bold text-base-content/70" href="/">{APP_NAME}</a>
				<p class="mt-4 text-xs font-medium text-base-content/60">
					{APP_NAME} ©
					{format(new Date(), 'yyyy')}
				</p>
			</div>
			<div class="mt-12 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
				<div class="grid grid-cols-2 gap-8 md:grid-cols-3">
					{#each navs as nav}
						<div>
							<h6 class="ml-1 text-lg font-bold text-base-content/80">{nav?.heading}</h6>
							<ul class="mt-4 space-y-1">
								{#each nav.links as link}
									<li>
										<a
											href={link.href}
											class="btn-ghost btn-sm btn whitespace-nowrap px-1 text-left font-medium text-base-content/60"
										>
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
