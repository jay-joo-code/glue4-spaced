<script lang="ts">
  import { page } from '$app/stores';
  import DynamicSection from '$lib/components/DynamicSection.svelte';

  $: ({ project, sections } = $page?.data);
</script>

<!-- TODO: remove padding in production mode (not edit mode) -->
<div class="pb-24">
  {#each sections as section, idx}
    <DynamicSection
      {section}
      nextSectionOrder={idx === sections?.length - 1 ? null : sections[idx + 1]?.order}
    />
  {/each}
</div>
