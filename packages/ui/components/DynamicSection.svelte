<script lang="ts">
  import { SectionHero } from '@glue/ui';
  export let section;
</script>

{#if section?.variant === 'SECTION_HERO'}
  <SectionHero {...section} />
{/if}
