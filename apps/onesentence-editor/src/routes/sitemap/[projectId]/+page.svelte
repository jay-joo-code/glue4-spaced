<script lang="ts">
  import { page } from '$app/stores';
  import EditorNavPanel from '$root/src/lib/components/EditorNavPanel.svelte';
  import PageSitemap from '$root/src/lib/components/PageSitemap.svelte';
  import PageContainer from '$root/src/lib/components/glue/PageContainer.svelte';

  $: ({ project } = $page?.data);
</script>

<PageContainer title="Edit project" limitWidth={false}>
  <div class="flex min-h-[80vh] w-full items-center justify-center relative">
    <EditorNavPanel projectId={project?.id} />

    {#each project?.expand['pages(project)'] as page}
      <PageSitemap {page} />
    {/each}
  </div>
</PageContainer>
