<script lang="ts">
  import { page } from '$app/stores';
  import { SectionHero } from '@glue/ui';

  $: ({ project } = $page?.data);
  $: pages = project?.expand['pages(project)'];
  $: currentPage = pages && pages?.length > 0 ? pages[0] : null;
</script>

{#if currentPage}
  {#each currentPage?.sections as section}
    <SectionHero {...section} />
  {/each}
{/if}
