<script lang="ts">
  import { DynamicSection } from '@glue/ui';

  export let page;
</script>

<div class="w-[40rem]">
  <div class="bg-base-100 w-full rounded-xl px-4 py-2">
    <p class="font-extrabold">{page?.name}</p>
  </div>

  <div class="mt-4 rounded-xl w-full border border-base-content/20 bg-base-100">
    <!-- TODO: navbar -->
    {#each page?.sections as section}
      <div class="border-b border-base-content/20 last:border-none">
        <DynamicSection {section} />
      </div>
    {/each}
  </div>
</div>
