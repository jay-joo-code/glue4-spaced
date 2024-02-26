<script lang="ts">
	import { page } from '$app/stores';
	import PageItem from '$root/src/lib/components/PageItem.svelte';
	import PageContainer from '$root/src/lib/components/glue/PageContainer.svelte';

	$: ({ project } = $page?.data);
	$: console.log('project', project);
</script>

<PageContainer title="Edit project" limitWidth={false}>
	<div class="flex min-h-[80vh] w-full items-center justify-center">
		{#each project?.expand['pages(project)'] as page}
			<PageItem {page} />
		{/each}
	</div>
</PageContainer>
