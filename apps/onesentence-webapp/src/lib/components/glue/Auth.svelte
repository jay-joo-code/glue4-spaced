<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		APP_NAME,
		IS_ENFORCE_CORNELL_EMAIL,
		IS_GOOGLE_AUTH_ONLY,
		PRIVATE_NAVS
	} from '$lib/glue/config';
	import { currentUser, pb } from '$lib/glue/pocketbase';
	import IconCopy from '$lib/icons/glue/IconCopy.svelte';
	import IconGoogle from '$lib/icons/glue/IconGoogle.svelte';
	import IconLogout from '$lib/icons/glue/IconLogout.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { onMount } from 'svelte';
	import TermsNotice from '../TermsNotice.svelte';

	let state: 'signin' | 'register' = 'register';

	const toggleState = () => {
		if (state === 'signin') state = 'register';
		else state = 'signin';
	};

	let authProviders = {};
	let redirectUrl = '';
	let isForceCornellModalOpen = false;

	onMount(async () => {
		try {
			if (window?.location?.pathname !== '/redirect') {
				localStorage.setItem('returnUrl', window?.location?.href);
			}

			const authMethods = await pb.collection('users').listAuthMethods();

			if (authMethods) {
				redirectUrl = `${window.location.origin}/redirect`;

				authMethods?.authProviders?.forEach((provider) => {
					authProviders[provider?.name] = provider;
				});

				const params = new URL(window.location as string).searchParams;
				const authCode = params.get('code');
				const provider =
					localStorage.getItem('provider') && localStorage.getItem('provider') !== 'undefined'
						? JSON.parse(localStorage.getItem('provider') || '')
						: null;

				if (authCode && provider.state === params.get('state')) {
					const authResult = await pb
						.collection('users')
						.authWithOAuth2('google', authCode, provider.codeVerifier, redirectUrl);

					pb.collection('users').update(authResult?.record?.id, {
						name: authResult?.meta?.rawUser?.name,
						avatarUrl: authResult?.meta?.rawUser?.picture
					});

					const email = authResult?.meta?.rawUser?.email;
					const isCornell = email?.split('@')[1] === 'cornell.edu';

					if (
						IS_ENFORCE_CORNELL_EMAIL &&
						!isCornell &&
						!['ridehub.carpool@gmail.com', 'revy.carpool@gmail.com']?.includes(email)
					) {
						signOut();
						isForceCornellModalOpen = true;
					}
				}

				$page.url.searchParams.delete('code');
				$page.url.searchParams.delete('state');
				$page.url.searchParams.delete('scope');
				$page.url.searchParams.delete('authuser');
				$page.url.searchParams.delete('hd');
				$page.url.searchParams.delete('prompt');

				let returnUrl =
					localStorage.getItem('returnUrl') || `?${$page.url.searchParams.toString()}`;
				goto(returnUrl);
			}
		} catch (error) {}
	});

	const signInGoogle = async () => {
		localStorage.setItem('provider', JSON.stringify(authProviders?.google));

		const url = authProviders?.google?.authUrl + redirectUrl;
		goto(url);
	};

	let email: string;
	let password: string;
	let username: string;

	async function login() {
		try {
			await pb.collection('users').authWithPassword(email, password);
		} catch (error) {}
	}

	async function signUp() {
		try {
			const data = {
				email,
				password,
				passwordConfirm: password,
				name: username
			};
			await pb.collection('users').create(data);
			await login();
		} catch (error) {}
	}

	function signOut() {
		pb.authStore.clear();
	}

	const handleSubmit = () => {
		if (state === 'signin') login();
		else if (state === 'register') signUp();
	};

	const handleCopyUrl = async () => {
		const url = 'https://www.revycarpool.com?ac=instagram-browser';
		if (browser && 'clipboard' in navigator) {
			await navigator.clipboard.writeText(url);
		} else {
			const element = document.createElement('input');

			element.type = 'text';
			element.disabled = true;

			element.style.setProperty('position', 'fixed');
			element.style.setProperty('z-index', '-100');
			element.style.setProperty('pointer-events', 'none');
			element.style.setProperty('opacity', '0');

			element.value = url;

			document.body.appendChild(element);

			element.click();
			element.select();
			document.execCommand('copy');

			document.body.removeChild(element);
		}
		toast.push('✅ URL copied to clipboard');
	};
</script>

<!-- modal: force cornell auth -->
<div class={`modal ${isForceCornellModalOpen && 'modal-open'}`} id="modal-force-cornell">
	<div class="modal-box w-11/12 max-w-sm">
		<h3 class="text-lg font-bold">Sign in with a @cornell.edu account</h3>
		<p class="py-4">
			You must sign in with a <span class="underline decoration-primary underline-offset-2"
				>Cornell email</span
			>
			to use {APP_NAME}.
		</p>
		<div class="flex justify-end space-x-2">
			<button
				class="btn-ghost btn"
				on:click={() => {
					isForceCornellModalOpen = false;
				}}>Close</button
			>
			<button type="button" class="btn-primary btn" on:click={signInGoogle}>Sign in again</button>
		</div>
	</div>
</div>

{#if $currentUser}
	<div class="dropdown-end dropdown">
		<label tabindex="0" class="btn-ghost btn-square btn">
			<div class="placeholder avatar">
				<div
					class="w-8 rounded-full bg-neutral-focus text-neutral-content ring-2 ring ring-primary ring-offset-2 ring-offset-base-100"
				>
					{#if $currentUser?.avatarUrl}
						<img src={$currentUser?.avatarUrl} />
					{:else}
						<span class="text-sm">{$currentUser?.name?.charAt(0)}</span>
					{/if}
				</div>
			</div>
		</label>
		<ul
			tabindex="0"
			class="menu-compact dropdown-content menu rounded-box mt-3 w-52 bg-base-200 p-2 shadow"
		>
			{#each PRIVATE_NAVS as nav}
				<li>
					<a href={nav.path}>
						<svelte:component this={nav.icon} />{nav.label}
					</a>
				</li>
			{/each}
			<li><button on:click={signOut}><IconLogout />Logout</button></li>
		</ul>
	</div>
{:else}
	<button>
		<label for="modal-auth" class="btn-sm btn whitespace-nowrap md:btn-md">Sign in</label>
	</button>

	<!-- auth modal -->
	<input type="checkbox" id="modal-auth" class="modal-toggle" />
	<label for="modal-auth" class="modal cursor-pointer">
		<label class="modal-box relative w-11/12 max-w-md" for="">
			<form on:submit|preventDefault={handleSubmit}>
				<div class="flex flex-col gap-3">
					{#if IS_GOOGLE_AUTH_ONLY}
						<h3 class="mb-2 p-0 text-xl font-extrabold text-gray-900 dark:text-white">
							Sign in
							{#if IS_ENFORCE_CORNELL_EMAIL}
								<span
									>with your <span class="underline decoration-primary underline-offset-2"
										>Cornell email</span
									></span
								>
							{:else}
								<span>to {APP_NAME}</span>
							{/if}
						</h3>
						<p class="mb-8">
							Access all of the features by signing in and getting started with {APP_NAME}.
							{#if IS_ENFORCE_CORNELL_EMAIL}
								<span class="">
									You must sign in with your Cornell email to sign into {APP_NAME}.
								</span>
							{/if}
						</p>
						<button type="button" class="btn-primary btn gap-2" on:click={signInGoogle}
							><IconGoogle /> Sign in with {IS_ENFORCE_CORNELL_EMAIL
								? 'Cornell email'
								: 'Google'}</button
						>
						<div class="mt-4">
							<TermsNotice />
						</div>
					{:else}
						<h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">
							{state === 'signin' ? 'Sign in to' : 'Create an account on'}
							{APP_NAME}
						</h3>
						{#if state === 'register'}
							<div class="form-control">
								<label class="label" for="username">Name</label>
								<input
									class="input-bordered input w-full max-w-xs"
									name="username"
									placeholder="John Doe"
									required
									bind:value={username}
								/>
							</div>
						{/if}
						<div class="form-control">
							<label class="label" for="email">Email</label>
							<input
								class="input-bordered input w-full max-w-xs"
								type="email"
								name="email"
								placeholder="name@company.com"
								required
								bind:value={email}
							/>
						</div>
						<div class="form-control">
							<label class="label" for="password">Password</label>
							<input
								class="input-bordered input w-full max-w-xs"
								type="password"
								name="password"
								placeholder="••••••••••"
								required
								bind:value={password}
							/>
						</div>
						<div class="flex items-center justify-between">
							<!-- NOTE: remember me checkbox -->
							<!-- <div class="form-control">
							<label class="label cursor-pointer">
								<div class="flex items-center gap-3">
									<input type="checkbox" checked={true} class="checkbox-primary checkbox" />
									<span class="label-text">Remember me</span>
								</div>
							</label>
						</div> -->
							{#if state === 'signin'}
								<div>
									<a
										href="/"
										class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
										>Lost password?</a
									>
								</div>
							{/if}
						</div>
						<button type="submit" class="btn-primary btn-block btn"
							>{state === 'signin' ? 'Sign in' : 'Create account'}</button
						>
						<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
							{state === 'signin' ? 'Not registered?' : 'Already have an account?'}
							<button
								class="text-blue-700 hover:underline dark:text-blue-500"
								on:click={toggleState}
								type="button"
								>{state === 'signin' ? 'Create account' : 'Sign in'}
							</button>
						</div>
					{/if}
				</div>
				<!-- <input placeholder="Username" type="text" bind:value={email} />
				<input placeholder="Password" type="password" bind:value={password} />
				<div class="mt-2 flex items-center gap-2">
					<button class="btn-sm btn" on:click={signUp}>Sign Up</button>
					<button class="btn-sm btn" on:click={login}>Login</button>
				</div> -->
			</form>
		</label>
	</label>
{/if}

<!-- prompt browser modal for Instagram in-app browser users -->
<input type="checkbox" id="modal-force-browser-instagram" class="modal-toggle" />
<label for="modal-force-browser-instagram" class="modal cursor-pointer">
	<label class="modal-box relative w-11/12 max-w-md" for="">
		<h2 class="text-2xl font-extrabold leading-relaxed">
			Uh oh, it looks like you're on Instagram
		</h2>
		<p class="mt-6 leading-relaxed text-base-content/80">
			Instagram's in-app browser restricts certain features, one of which is Google authentication.
		</p>
		<p class="mt-3 leading-relaxed">
			Google authentication is core to verifying that you're a Cornellian.
		</p>
		<p class="mt-3 leading-relaxed">
			Please open <span class="font-bold">REVY</span> on a browser like Safari or Chrome.
		</p>
		<div class="relative mt-6 w-full">
			<button
				class="w-full overflow-hidden whitespace-nowrap rounded-xl border border-primary bg-base-300 p-3"
				on:click={handleCopyUrl}
				>https://www.revycarpool.com?ac=instagram-browser
			</button>
			<div class="absolute right-2 top-0 bottom-0 my-auto flex items-center">
				<button class="rounded-xl bg-base-100 p-2" on:click={handleCopyUrl}>
					<IconCopy />
				</button>
			</div>
		</div>
		<p class="mt-2 text-center text-xs text-base-content/70">Copy paste the URL to a browser</p>
	</label></label
>
