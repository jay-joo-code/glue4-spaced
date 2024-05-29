<script>
  import ListingItem from '$root/src/lib/components/ListingItem.svelte';
  import { APP_NAME } from '$root/src/lib/config';
  import { PageContainer } from '@glue/ui';

  export let data;
</script>

<PageContainer {APP_NAME} title="My listings">
  <h1 class="text-3xl font-extrabold mb-8">My listings</h1>

  {#await data.myListings}
    <span class="loading loading-spinner loading-sm" />
  {:then myListings}
    {#if myListings}
      {#each myListings as listing (listing.id)}
        <ListingItem {listing} />
      {/each}
    {/if}
  {/await}
</PageContainer>
