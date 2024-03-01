import type { SvelteComponent } from 'svelte';

export interface IPublicNav {
	path: string;
	label: string;
}

export interface IPrivateNav {
	path: string;
	label: string;
	icon: typeof SvelteComponent;
}
