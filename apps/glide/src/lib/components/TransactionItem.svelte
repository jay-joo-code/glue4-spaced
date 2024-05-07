<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { transactionHasRefunds, type TransactionWithRefunds } from '$lib/types/transaction.type';
  import { formatMoney } from '$lib/util/transaction';
  import type { SelectTransaction } from '$root/src/db/schema.server';
  import { IconMoreVert, IconRefresh } from '@glue/ui';
  import { format, parse } from 'date-fns';
  import debounce from 'just-debounce-it';

  export let transaction: TransactionWithRefunds | SelectTransaction;
  export let refundId: string;
  export let dialogAssignRefund: HTMLDialogElement | undefined = undefined;

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

  $: netAmount = transactionHasRefunds(transaction)
    ? transaction.refunds.reduce((amount, refund) => (amount += refund.amount), transaction.amount)
    : transaction.amount;
</script>

<div class="border-b px-2 py-2 w-full border-base-content/10">
  <div class="flex justify-between space-x-8">
    <div class="flex-1">
      {#if transaction.usageDate}
        <div class="flex items-center space-x-1">
          <p class="text-sm text-base-content/60 mt-0.5">
            {format(parse(transaction.usageDate, 'yyyy-MM-dd', new Date()), 'EEE MM/dd')}
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
        {#if transactionHasRefunds(transaction) && transaction.refunds.length > 0}
          <div class="flex space-x-2 items-center">
            <p class="font-medium text-base-content/60 line-through">
              {formatMoney(transaction.amount)}
            </p>
            <p class="font-medium">{formatMoney(netAmount)}</p>
          </div>
        {:else}
          <p class="font-medium">{formatMoney(transaction.amount)}</p>
        {/if}
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
          {#if dialogAssignRefund}
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
            <li>
              <a
                on:click={() => {
                  refundId = transaction.id;
                  dialogAssignRefund.showModal();
                }}
                >Add refund
              </a>
            </li>
          {:else}
            <li>
              <a
                on:click={() => {
                  updateTransaction(transaction.id, {
                    refundId
                  });
                }}
                >Add as refund
              </a>
            </li>
          {/if}
        </ul>
      </div>
    </div>
  </div>

  {#if transactionHasRefunds(transaction)}
    <div class="mt-4 pr-11">
      {#each transaction.refunds as refund}
        <div class="flex justify-between items-center">
          <div class="">
            <p class="text-base-content/60">{refund.name}</p>
          </div>

          <div class="">
            <p class="text-success">{formatMoney(refund.amount)}</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
