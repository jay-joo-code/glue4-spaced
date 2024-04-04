<script lang="ts">
  import { IconAdd } from '@glue/ui';
  import { SECTION_HERO, sectionDesc, sectionTitle } from '../util/constants';
  import { pb } from '../glue/pocketbase';
  import { invalidateAll } from '$app/navigation';

  export let page;

  let isLoadingAddSection = false;

  const addSection = async () => {
    isLoadingAddSection = true;
    await pb.collection('pages').update(page?.id, {
      sections: [
        ...page?.sections,
        {
          variant: SECTION_HERO
        }
      ]
    });
    await invalidateAll();
    isLoadingAddSection = false;
  };
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
    <button class="btn btn-block btn-sm" on:click={addSection} disabled={isLoadingAddSection}>
      {#if isLoadingAddSection}
        <span class="loading loading-spinner loading-xs" />
      {/if}
      <IconAdd />
      Add section
    </button>
  </div>
</div>
