<script lang="ts">
  import { IconAdd } from '@glue/ui';
  import { sectionDesc, sectionTitle } from '../util/constants';

  export let page;
</script>

<div class="border-base-content/20 w-[16rem] rounded-xl border">
  <div class="border-base-content/20 rounded-t-xl border-b px-4 py-3">
    <p class=" font-extrabold">{page?.name} page</p>
  </div>
  <div class="px-2 py-2">
    {#each page?.sections as section}
      <div class="border-base-content/10 mb-2 rounded-xl border px-3 py-2">
        <p class="text-sm font-bold">{sectionTitle[section?.variant]}</p>
        <p class="text-base-content/80 mt-1 text-xs leading-normal">
          {sectionDesc[section?.variant]}
        </p>
      </div>
    {/each}
    <button class="btn btn-block btn-sm">
      <IconAdd />
      Add section
    </button>
  </div>
</div>
