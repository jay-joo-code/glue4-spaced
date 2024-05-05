<script lang="ts">
  import { APP_NAME } from '$lib/config';
  import { IconAdd, PageContainer } from '@glue/ui';

  export let data;
</script>

<PageContainer {APP_NAME} title="Home">
  <section class="py-12">
    <div class="flex justify-between items-center">
      <p class="text-4xl font-extrabold">Integrations</p>
      <button class="btn btn-primary btn-sm">
        <IconAdd />
        Add integration</button
      >
    </div>
    <div class="mt-6">
      {#await data.items}
        <span class="loading loading-spinner loading-sm" />
      {:then items}
        {#if !items}
          <p class="text-sm text-base-content/80">Failed to load integrations</p>
        {:else if items.length === 0}
          <p class="text-sm text-base-content/80">Create an integration to get started</p>
        {:else}
          {#each items as item}
            <p class="">{item.id}</p>
          {/each}
        {/if}
      {/await}
    </div>
  </section>
</PageContainer>
