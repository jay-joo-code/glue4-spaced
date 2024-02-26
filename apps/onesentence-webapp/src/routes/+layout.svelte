<script>
	import AppLayout from '$lib/components/glue/AppLayout.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	const toastOptions = {
		dismissable: false,
		theme: {
			'--toastContainerRight': '1rem',
			'--toastBarHeight': '0',
			'--toastPadding': '0.2rem 0.6rem',
			'--toastMsgPadding': '0.2rem 0.2rem 0.2rem 0.4rem',
			'--toastBorderRadius': '0.5rem',
			'--toastMinHeight': '0',
			'--toastWidth': 'auto'
		}
	};
</script>

<div class="toast-styles">
	<SvelteToast options={toastOptions} />
</div>

<AppLayout>
	<slot />
</AppLayout>

<style>
	.toast-styles {
		font-size: 0.9rem;
	}
</style>
