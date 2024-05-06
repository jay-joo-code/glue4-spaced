<script lang="ts">
  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  import { APP_NAME } from '$lib/config';
  import { PageContainer } from '@glue/ui';
  import { format } from 'date-fns';
  import { formatMoney, parseTransactionsCSV } from '../lib/util/transaction';

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
      },
      onExit: (err, metadata) => {
        console.log('err, metadata', err, metadata);
      },
      onEvent: (eventName, metadata) => {
        console.log('eventName, metadata', eventName, metadata);
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

    const responses = await (
      await fetch('/api/plaid/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    ).json();

    // TODO: remove
    responses.map((response: any) => console.log('response', response));

    await invalidateAll();

    isLoadingSync = false;
  };

  const handleFileUpload = async (event: Event & { currentTarget: HTMLInputElement }) => {
    if (event.currentTarget?.files && event.currentTarget?.files?.length > 0) {
      const parsedTransactions = await parseTransactionsCSV(event.currentTarget?.files[0]);
      await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parsedTransactions
        })
      });
      invalidateAll();
    }
  };
</script>

<PageContainer {APP_NAME} title="Home">
  <section class="py-4">
    <h2 class="text-3xl font-extrabold">Upload transactions</h2>

    <label class="form-control w-full max-w-xs">
      <div class="label">
        <span class="label-text">Upload transaction CSV</span>
      </div>
      <input
        class="file-input file-input-bordered file-input-sm"
        type="file"
        on:input={handleFileUpload}
      />
    </label>
  </section>

  <section class="py-12 mt-8">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-extrabold">Expenses</h2>

      <!-- <button class="btn" on:click={handleSync}>
        {#if isLoadingSync}
          <span class="loading loading-spinner loading-sm" />
        {:else}
          <span class="text-xl"><IconRefresh /></span>
          Sync
        {/if}
      </button> -->
    </div>

    <div class="mt-8">
      {#await data.weeklyExpenses}
        <span class="loading loading-spinner loading-sm" />
      {:then weeklyExpenses}
        {#if weeklyExpenses}
          <div class="space-y-6">
            {#each weeklyExpenses as { weekString, totalAmount, transactions }}
              <div class="">
                <div class="flex items-center justify-between px-2">
                  <p class="text-sm font-extrabold text-base-content/60">{weekString}</p>
                  <p class="text-sm font-extrabold text-error">{formatMoney(totalAmount)}</p>
                </div>
                <div class="space-y-2 mt-3">
                  {#each transactions as transaction}
                    <button
                      class="border rounded-xl px-4 py-2 flex justify-between items-center w-full text-left border-base-content/10 hover:bg-base-content/10"
                    >
                      <div class="">
                        <p class="text-sm">{transaction.name}</p>
                        {#if transaction.usageDate}
                          <p class="text-sm text-base-content/60 mt-0.5">
                            {format(transaction.usageDate, 'EEE MM/dd')}
                          </p>
                        {/if}
                      </div>
                      <div class="text-right">
                        <p class="font-medium">{formatMoney(transaction.amount)}</p>
                      </div>
                    </button>
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      {/await}
    </div>
  </section>

  <!-- <section class="py-12">
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
  </section> -->
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
