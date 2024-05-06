<script lang="ts">
  import { browser } from '$app/environment';
  import { enhance } from '$app/forms';
  import { invalidateAll } from '$app/navigation';
  import { APP_NAME } from '$lib/config';
  import { IconAdd, IconDelete, IconRefresh, PageContainer } from '@glue/ui';
  import { formatDistanceToNow } from 'date-fns';

  export let data;
  export let form;

  let isLoadingCreateIntegration = false;
  let isLoadingDeleteItem = false;
  let isLoadingSync = false;

  let deleteItemId: string | null = null;
  let dialog: HTMLDialogElement;

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
        await invalidateAll();
        isLoadingCreateIntegration = false;
      }
    });
    handler.open();
  }

  const handleDeleteItem = async () => {
    isLoadingDeleteItem = true;

    await fetch('/api/item', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        itemId: deleteItemId
      })
    });
    await invalidateAll();
    dialog.close();

    isLoadingDeleteItem = false;
  };

  const handleSync = async () => {
    isLoadingSync = true;

    const response = await (
      await fetch('/api/plaid/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    ).json();
    console.log('response', response);
    await invalidateAll();

    isLoadingSync = false;
  };
</script>

<PageContainer {APP_NAME} title="Home">
  <section class="py-12">
    <div class="flex justify-between items-center">
      <div class="">
        <h2 class="text-3xl font-extrabold">Expenses</h2>
        <p class="text-base-content/80 text-sm mt-2">Track all of your expenses in one place</p>
      </div>

      <button class="btn btn-ghost" on:click={handleSync}>
        {#if isLoadingSync}
          <span class="loading loading-spinner loading-sm" />
        {:else}
          <span class="text-xl"><IconRefresh /></span>
          Sync
        {/if}
      </button>
    </div>
  </section>
  <section class="py-12">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-extrabold">Integrations</h2>
      <form
        method="POST"
        action="?/createPlaidToken"
        use:enhance={() => {
          isLoadingCreateIntegration = true;
        }}
      >
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
            <div
              class="flex justify-between items-center border border-base-content/10 rounded-xl px-4 py-2"
            >
              <div class="">
                <p class="text-lg font-medium">{item.institution}</p>
                <p class="text-xs text-base-content/80">
                  Synced {formatDistanceToNow(item.updatedAt, { addSuffix: true })}
                </p>
              </div>
              <button
                class="btn btn-ghost"
                on:click={() => {
                  deleteItemId = item.id;
                  dialog.showModal();
                }}
              >
                <span class="text-xl">
                  <IconDelete />
                </span>
              </button>
            </div>
          {/each}
        {/if}
      {/await}
    </div>
  </section>
</PageContainer>

<dialog bind:this={dialog} class="modal cursor-pointer">
  <div class="modal-box relative box-border max-h-[70vh] max-w-sm">
    <h2 class="text-xl font-extrabold">Delete integration</h2>
    <p class="text-sm text-base-content/80 mt-3">
      This action will permanantly delete this integration. The integration cannot be recovered.
    </p>
    <div class="flex justify-end space-x-2 mt-6">
      <button
        class="btn btn-ghost btn-sm"
        on:click={() => {
          dialog.close();
        }}>Cancel</button
      >
      <button class="btn btn-sm btn-error" on:click={handleDeleteItem}>
        {#if isLoadingDeleteItem}
          <span class="loading loading-spinner loading-sm" />
        {:else}
          Delete
        {/if}
      </button>
    </div>
  </div>

  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
