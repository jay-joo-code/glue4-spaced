<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import TextInput from '$lib/components/glue/TextInput.svelte';
	import { APP_NAME } from '$lib/glue/config';

	import IconGoogle from '$lib/icons/glue/IconGoogle.svelte';

	let email: string = '';
	let isMagicLinkSent: boolean = false;
	let isMagicLinkLoading: boolean = false;
	let magicLinkError: string = '';

	const signInWithGoogle = async () => {
		const redirectTo = `${$page.url.origin}/redirect?${$page.url.searchParams.toString()}`;

		await $page?.data?.supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo
			}
		});
	};

	const signInEmailMagicLink = async () => {
		isMagicLinkLoading = true;

		const emailRedirectTo = `${$page.url.origin}/redirect?${$page.url.searchParams.toString()}`;

		const { error } = await $page?.data?.supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo
			}
		});

		if (error) {
			magicLinkError = error.message;
		} else {
			isMagicLinkSent = true;
			magicLinkError = '';
		}

		isMagicLinkLoading = false;
	};

	afterNavigate(({ from }) => {
		if (from?.url && !$page.url.searchParams.get('redirectTo')) {
			$page.url.searchParams.set('redirectTo', from?.url.pathname + from?.url.search);
			goto(`?${$page.url.searchParams.toString()}`);
		}
	});
</script>

<PageContainer title="Sign in" isHoriPadding={false} limitWidth={false} isVertPadding={false}>
	<div class="flex h-full min-h-[85vh] items-center justify-center bg-base-200 px-4">
		<div
			class="my-8 w-full rounded-xl border border-base-content/20 bg-base-100 px-8 py-16 text-center sm:max-w-sm">
			<h1 class="text-3xl font-bold">Welcome back</h1>
			<p class="mt-2 text-sm text-base-content/70">Sign in to get started with {APP_NAME}</p>

			<!-- oauth -->
			<div class="mt-12 space-y-4">
				<button
					type="button"
					class="btn-outline btn-block btn mt-2 gap-2"
					on:click={signInWithGoogle}>
					<IconGoogle /> Sign in with Google
				</button>
			</div>

			<div class="divider mt-10 mb-4">OR</div>

			<!-- magic link -->
			<form on:submit|preventDefault={signInEmailMagicLink}>
				{#if isMagicLinkSent}
					<div class="mt-6 rounded-xl bg-success/5 p-4">
						<p class="text-center text-sm text-success">
							A sign in link has been sent to your email!
						</p>
					</div>
					<button
						class="btn-ghost btn-xs btn mt-4"
						on:click={() => {
							isMagicLinkSent = false;
							email = '';
						}}>
						Use a different email
					</button>
				{:else}
					<TextInput bind:value={email} name="email" label="Email" type="email" />
					<button
						class="btn-primary btn-block btn mt-4"
						disabled={!Boolean(email) || isMagicLinkLoading}>
						{#if isMagicLinkLoading}
							<span class="loading loading-spinner" />
						{/if}
						Sign in with email
					</button>
					{#if magicLinkError}
						<p class="mt-2 text-xs text-error">{magicLinkError}</p>
					{/if}
				{/if}
			</form>

			<!-- terms -->
			<p class="mt-12 text-xs !leading-normal text-base-content/70">
				By signing in to {APP_NAME}, you agree to our
				<a class="link" href="/terms-conditions" target="_blank" rel="noreferrer">
					terms and conditions
				</a>
				and
				<a class="link" href="/privacy-policy" target="_blank" rel="noreferrer">privacy policy</a>
			</p>
		</div>
	</div>
</PageContainer>
