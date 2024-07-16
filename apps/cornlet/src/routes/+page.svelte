<script lang="ts">
  import { IconFilterList, PageContainer } from '@glue/ui';
  import { APP_NAME } from '$lib/config';
  import ListingItem from '$lib/components/ListingItem.svelte';

  export let data;
</script>

<PageContainer
  {APP_NAME}
  title="Home"
  limitWidth={false}
  class="max-w-3xl"
  isVertPadding={false}
  isHoriPadding={false}
>
  <div class="border-b border-base-content/10 p-4">
    <div class="hidden md:block">
      <h1 class="text-2xl font-extrabold">Sublet listings</h1>
      <p class="text-sm mt-2 text-base-content/80">Find sublets based on your search criteria</p>
    </div>

    <div class="flex space-x-3">
      <button class="btn btn-outline">Price</button>
      <button class="btn btn-outline"
        ><span class="text-xl"><IconFilterList /></span> More filters</button
      >
    </div>
  </div>

  <div class="mt-4 px-4">
    {#await data.listings}
      <span class="loading loading-spinner loading-sm" />
    {:then listings}
      {#if listings}
        {#each listings as listing}
          <ListingItem {listing} currentUserId={data.user?.id} />
        {/each}
      {/if}
    {/await}
  </div>
</PageContainer>
