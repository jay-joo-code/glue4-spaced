<script lang="ts">
	export let card;
</script>

{#if card}
	<li class="text-sm leading-6">
		<figure
			class="dark:highlight-white/5 relative flex flex-col-reverse rounded-lg bg-slate-50 p-6 dark:bg-slate-800"
		>
			<blockquote class="mt-6 text-slate-700 dark:text-slate-300">
				<p>
					{card?.desc}
				</p>
			</blockquote>
			<figcaption class="flex items-center space-x-4">
				<img
					src={card?.imagePath}
					alt=""
					class="h-12 w-12 flex-none object-cover"
					loading="lazy"
					decoding="async"
				/>
				<div class="flex-auto">
					<div class="text-base font-semibold text-slate-900 dark:text-slate-300">
						{card?.heading}
					</div>
					<div class="mt-0.5">
						<p class="text-sm text-base-content/90">{card?.subheading}</p>
					</div>
				</div>
			</figcaption>
		</figure>
	</li>
{/if}
