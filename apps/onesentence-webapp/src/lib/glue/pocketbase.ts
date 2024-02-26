import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

export const POCKETBASE_URL = 'https://onesentence.pockethost.io';
export const pb = new PocketBase(POCKETBASE_URL);
export const currentUser = writable(pb.authStore.model);

pb.autoCancellation(false);

pb.authStore.onChange((auth) => {
	currentUser.set(pb.authStore.model);
});
