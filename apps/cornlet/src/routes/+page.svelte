<script lang="ts">
  import { PageContainer } from '@glue/ui';
  import { APP_NAME } from '$lib/config';
  import ListingItem from '$lib/components/ListingItem.svelte';

  export let data;
</script>

<PageContainer {APP_NAME} title="Home">
  {#await data.listings}
    <span class="loading loading-spinner loading-sm" />
  {:then listings}
    {#if listings}
      {#each listings as listing}
        <ListingItem {listing} currentUserId={data.user?.id} />
      {/each}
    {/if}
  {/await}
</PageContainer>
