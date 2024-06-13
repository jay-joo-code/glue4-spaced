<script>
  import ListingItem from '$root/src/lib/components/ListingItem.svelte';
  import { APP_NAME } from '$root/src/lib/config';
  import { PageContainer } from '@glue/ui';

  export let data;
</script>

<PageContainer {APP_NAME} title="My listings" limitWidth={false} class="max-w-3xl">
  <h1 class="text-3xl font-extrabold mb-8 md:ml-3">My listings</h1>

  {#await data.myListings}
    <span class="loading loading-spinner loading-sm" />
  {:then myListings}
    {#if myListings}
      {#each myListings as listing (listing.id)}
        <ListingItem {listing} currentUserId={data.user?.id} />
      {/each}
    {/if}
  {/await}
</PageContainer>
