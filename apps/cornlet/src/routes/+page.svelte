<script lang="ts">
  import { PageContainer } from '@glue/ui';
  import { APP_NAME } from '$lib/config';

  export let data;
</script>

<PageContainer {APP_NAME} title="Home">
  {#await data.listings}
    <span class="loading loading-spinner loading-sm" />
  {:then listings}
    {#if listings}
      {#each listings as listing}
        <div class="">
          <p class="text-xl font-extrabold">{listing.address}</p>
        </div>
      {/each}
    {/if}
  {/await}
</PageContainer>
