<script>
  import { APP_NAME } from '$root/src/lib/config';
  import { PageContainer } from '@glue/ui';

  export let data;
</script>

<PageContainer {APP_NAME} title="Profile">
  {#await data.userDetails}
    <p class="">Loading</p>
  {:then userDetails}
    {#if userDetails}
      <p class="">Email: {userDetails.email}</p>
    {:else}
      <p class="">User not found</p>
    {/if}
  {/await}
</PageContainer>
