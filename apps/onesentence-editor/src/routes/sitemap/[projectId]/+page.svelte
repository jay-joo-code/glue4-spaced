<script lang="ts">
  import { page } from '$app/stores';
  import PageItem from '$root/src/lib/components/PageItem.svelte';
  import PageContainer from '$root/src/lib/components/glue/PageContainer.svelte';
  import { IconMap, IconPalette, IconRocket, IconCube } from '@glue/ui';

  $: ({ project } = $page?.data);
</script>

<PageContainer title="Edit project" limitWidth={false}>
  <div class="flex min-h-[80vh] w-full items-center justify-center relative">
    <div class="absolute top-10 left-0 right-0 flex justify-center">
      <ul class="menu menu-horizontal bg-base-200 rounded-box">
        <li>
          <a href="/sitemap/{project?.id}"><span class="text-lg"><IconMap /></span>Sitemap</a>
        </li>
        <li>
          <a href="/design/{project?.id}"><span class="text-lg"><IconCube /></span>Design</a>
        </li>
        <li>
          <a href="/theme/{project?.id}"><span class="text-lg"><IconPalette /></span>Theme</a>
        </li>
        <li>
          <a href="/publish/{project?.id}"><span class="text-lg"><IconRocket /></span>Publish</a>
        </li>
      </ul>
    </div>

    {#each project?.expand['pages(project)'] as page}
      <PageItem {page} />
    {/each}
  </div>
</PageContainer>
