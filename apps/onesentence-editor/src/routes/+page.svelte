<script lang="ts">
	import { goto } from '$app/navigation';
	import PageContainer from '$lib/components/glue/PageContainer.svelte';
	import TextInput from '../lib/components/glue/TextInput.svelte';
	import { currentUser, pb } from '../lib/glue/pocketbase';
	import { SECTION_HERO } from '../lib/util/constants';

	let prompt = '';
	let isLoadingCreateProject = false;

	const handleCreateProject = async () => {
		if (!prompt) return;

		isLoadingCreateProject = true;
		const project = await pb.collection('projects').create({
			prompt,
			user: $currentUser
		});
		await pb.collection('pages').create({
			name: 'Home',
			project: project?.id,
			user: $currentUser,
			sections: [{ variant: SECTION_HERO }]
		});
		goto(`/sitemap/${project?.id}`);
		isLoadingCreateProject = false;
	};
</script>

<PageContainer title="Home">
	<div class="flex min-h-[80vh] items-center justify-center">
		<form class="w-[30rem] max-w-full" on:submit={handleCreateProject}>
			<TextInput label="Prompt" bind:value={prompt} />
			<div class="mt-4 flex justify-end">
				<button class="btn btn-primary" disabled={isLoadingCreateProject}>
					{#if isLoadingCreateProject}
						<span class="loading loading-spinner loading-xs" />
					{/if}
					Generate
				</button>
			</div>
		</form>
	</div>
</PageContainer>
