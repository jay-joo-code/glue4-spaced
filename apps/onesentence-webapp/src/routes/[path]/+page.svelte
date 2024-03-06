<script lang="ts">
  import { page } from '$app/stores';
  import DynamicSection from '$lib/components/DynamicSection.svelte';

  $: ({ project, sections } = $page?.data);
</script>

{#each sections as section}
  <DynamicSection {section} />
{/each}
