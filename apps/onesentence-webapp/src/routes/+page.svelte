<script lang="ts">
  import { page } from '$app/stores';
  import { DynamicSection } from '@glue/ui';

  $: ({ project } = $page?.data);
  $: pages = project?.expand['pages(project)'];
  $: tempFirstPage = pages && pages?.length > 0 ? pages[0] : null; // TODO: dynamically parse current page
</script>

{#if tempFirstPage}
  {#each tempFirstPage?.sections as section}
    <DynamicSection {section} />
  {/each}
{/if}
