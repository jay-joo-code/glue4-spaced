<script lang="ts">
  import { page } from '$app/stores';
  import EditorNavPanel from '$root/src/lib/components/EditorNavPanel.svelte';
  import PageDesign from '$root/src/lib/components/PageDesign.svelte';
  import PageSitemap from '$root/src/lib/components/PageSitemap.svelte';
  import PageContainer from '$root/src/lib/components/glue/PageContainer.svelte';

  $: ({ project } = $page?.data);
</script>

<PageContainer title="Edit project" limitWidth={false} class="bg-base-200">
  <div class="flex min-h-[80vh] w-full items-center justify-center relative">
    <EditorNavPanel projectId={project?.id} />

    {#each project?.expand['pages(project)'] as page}
      <PageDesign {page} />
    {/each}
  </div>
</PageContainer>
