<script lang="ts">
  import { browser } from '$app/environment';
  import { enhance } from '$app/forms';
  import { APP_NAME } from '$lib/config';
  import { IconAdd, PageContainer } from '@glue/ui';
  import { invalidateAll } from '$app/navigation';

  export let data;
  export let form;

  let isLoadingCreateIntegration = false;

  $: if (browser && form?.link_token) {
    // @ts-expect-error
    const handler = window.Plaid?.create({
      token: form?.link_token,
      onSuccess: async (public_token: string, metadata: any) => {
        await fetch('/api/plaid/create-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            public_token,
            institution: metadata.institution.name
          })
        });
        invalidateAll();
      }
    });
    handler.open();
  }
</script>

<PageContainer {APP_NAME} title="Home">
  <section class="py-12">
    <div class="flex justify-between items-center">
      <p class="text-4xl font-extrabold">Integrations</p>
      <form method="POST" action="?/createPlaidToken" use:enhance>
        <button class="btn btn-primary btn-sm">
          {#if isLoadingCreateIntegration}
            <span class="loading loading-spinner loading-sm" />
          {:else}
            <IconAdd />
            Add integration
          {/if}
        </button>
      </form>
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
