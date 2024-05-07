<script lang="ts">
  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  import { APP_NAME } from '$lib/config';
  import { IconMoreVert, IconNewTab, IconRefresh, PageContainer } from '@glue/ui';
  import { format, parse } from 'date-fns';
  import debounce from 'just-debounce-it';
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
      console.log('parsedTransactions', parsedTransactions);
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

  const updateTransaction = async (transactionId: string, data: any) => {
    await fetch('/api/transaction', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transactionId,
        data
      })
    });
    await invalidateAll();
  };

  const handleInputName = async (event: InputEvent, transactionId: string) => {
    const target = event.target as HTMLInputElement;
    fetch('/api/transaction', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transactionId,
        data: {
          displayName: target.value
        }
      })
    });
  };

  const debouncedHandleInputName = debounce(handleInputName, 500);
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

    <div class="flex items-center space-x-4 mt-8">
      <a
        class="btn btn-sm btn-primary"
        href="https://account.venmo.com/statement"
        target="_blank"
        rel="noreferrer"
        >Venmo
        <IconNewTab />
      </a>
      <a
        class="btn btn-sm btn-primary"
        href="https://secure.chase.com/web/auth/dashboard#/dashboard/accountDetails/downloadAccountTransactions/index;params=DDA,CHK,891906848"
        target="_blank"
        rel="noreferrer"
        >Chase
        <IconNewTab />
      </a>
    </div>
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
          <div class="space-y-8">
            {#each weeklyExpenses as { weekString, totalAmount, transactions }}
              <div class="">
                <div
                  class="flex items-center justify-between pl-4 pr-12 bg-base-300 rounded-xl py-2"
                >
                  <p class="text-sm font-extrabold text-base-content/60">{weekString}</p>
                  <p class="text-sm font-extrabold text-error">{formatMoney(totalAmount)}</p>
                </div>
                <div class="space-y-2 mt-3">
                  {#each transactions as transaction}
                    <div
                      class="border-b px-2 py-2 flex justify-between items-center w-full border-base-content/10 space-x-8"
                    >
                      <div class="flex-1">
                        {#if transaction.usageDate}
                          <div class="flex items-center space-x-1">
                            <p class="text-sm text-base-content/60 mt-0.5">
                              {format(
                                parse(transaction.usageDate, 'yyyy-MM-dd', new Date()),
                                'EEE MM/dd'
                              )}
                            </p>
                            <input
                              class="input input-sm max-w-[1.3rem] h-[unset] leading-[unset] !p-0"
                              type="date"
                              bind:value={transaction.usageDate}
                              on:input={(event) => {
                                updateTransaction(transaction.id, {
                                  usageDate: event.currentTarget?.value,
                                  isChangedDate: true
                                });
                              }}
                            />
                            {#if transaction.isChangedDate}
                              <button
                                class="btn btn-circle btn-xs btn-ghost text-lg"
                                on:click={() => {
                                  updateTransaction(transaction.id, {
                                    usageDate: transaction.date,
                                    isChangedDate: false
                                  });
                                }}><IconRefresh /></button
                              >
                            {/if}
                          </div>
                        {:else}
                          <p class="text-sm text-base-content/60 mt-0.5">Date unset</p>
                        {/if}
                        <input
                          class="input w-full !py-1 !px-0 h-[unset]"
                          bind:value={transaction.displayName}
                          on:input={(event) => debouncedHandleInputName(event, transaction.id)}
                        />
                      </div>
                      <div class="flex items-center space-x-3">
                        <div class="text-right">
                          <p class="text-sm text-base-content/60 mb-0.5 capitalize">
                            {transaction.source}
                          </p>
                          <p class="font-medium">{formatMoney(transaction.amount)}</p>
                        </div>
                        <div class="dropdown w-full dropdown-end">
                          <button
                            class="text-2xl btn btn-circle btn-sm btn-ghost text-base-content/50"
                            tabindex="0"
                            role="button"><IconMoreVert /></button
                          >
                          <ul
                            tabindex="0"
                            class="dropdown-content z-[1] menu p-2 shadow bg-base-300 rounded-box w-52"
                          >
                            <li>
                              <a
                                on:click={() => {
                                  updateTransaction(transaction.id, {
                                    isIgnore: true
                                  });
                                }}
                                >Ignore
                              </a>
                            </li>
                            <li>
                              <a
                                on:click={() => {
                                  updateTransaction(transaction.id, {
                                    isPendingRefund: true
                                  });
                                }}
                                >Pending refund
                              </a>
                            </li>
                            <li>
                              <a
                                on:click={() => {
                                  updateTransaction(transaction.id, {
                                    isRecurring: true
                                  });
                                }}
                                >Recurring
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
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
