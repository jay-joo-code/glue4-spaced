<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import Loading from '$lib/components/glue/Loading.svelte';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import TextInput from '$lib/components/glue/TextInput.svelte';
	import imageCompression from 'browser-image-compression';

	export let data;

	let name: string = '';
	let isUploadLoading: boolean = false;
	let avatarPath: string = '';
	let avatarUrl: string = '';
	let isSaveLoading: boolean = false;

	const uploadPhoto = async (event: Event & { currentTarget: HTMLInputElement }) => {
		isUploadLoading = true;
		const avatarFile = event?.currentTarget?.files?.[0];

		if (avatarFile) {
			const options = {
				maxSizeMB: 2,
				maxWidthOrHeight: 256,
				useWebWorker: true
			};

			const compressedFile = await imageCompression(avatarFile, options);

			const { data: photo } = await data?.supabase.storage
				.from('avatars')
				.upload(`${data?.session?.user?.id}/${avatarFile?.name}`, compressedFile, {
					cacheControl: '3600',
					upsert: true
				});

			if (photo?.path) {
				avatarPath = photo?.path;
				const { data: publicUrlData } = data?.supabase.storage
					.from('avatars')
					.getPublicUrl(avatarPath);
				avatarUrl = publicUrlData?.publicUrl || '';
			}

			isUploadLoading = false;
		}
	};

	const saveProfile = async () => {
		isSaveLoading = true;

		const redirectTo = $page.url.searchParams.get('redirectTo');
		$page.url.searchParams.delete('redirectTo');
		const url = `${$page.url.origin}${redirectTo || '/'}`;

		await data?.supabase
			.from('profiles')
			.upsert({
				id: data?.session?.user?.id,
				name
			})
			.single();

		await invalidateAll();
		goto(url);

		isSaveLoading = false;
	};
</script>

<PageContainer title="Set up your profile" layout="mobile-only">
	<div class="flex w-full justify-center">
		<div class="w-full md:max-w-md">
			<h1 class="text-2xl font-bold">Complete your profile</h1>
			<form class="mt-6">
				<div class="mt-3">
					<TextInput bind:value={name} label="Name" required />
				</div>
				<div class="mt-8">
					<p class="ml-1 text-sm font-semibold text-base-content/90">
						Photo <span class="text-base-content/70">(optional)</span>
					</p>
					<input
						type="file"
						class="file-input-bordered file-input file-input-sm mt-4 w-full max-w-xs"
						required
						on:input={uploadPhoto}
						accept="image/png, image/jpeg" />
					{#if isUploadLoading}
						<div class="mt-4">
							<Loading />
						</div>
					{/if}
					{#if avatarPath}
						<div class="avatar mt-4">
							<div class="w-36 max-w-full rounded-xl border border-base-content/10">
								<img src={avatarUrl} alt="avatar" />
							</div>
						</div>
					{/if}
				</div>
				<button
					class="btn-primary btn mt-8"
					on:click={saveProfile}
					disabled={isUploadLoading || isSaveLoading}>
					{#if isSaveLoading}
						<span class="loading loading-spinner" />
					{/if}
					Save profile
				</button>
			</form>
		</div>
	</div>
</PageContainer>
