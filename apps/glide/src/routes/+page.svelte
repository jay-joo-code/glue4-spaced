<script lang="ts">
  import { browser } from '$app/environment';
  import { invalidateAll } from '$app/navigation';
  import TransactionItem from '$lib/components/TransactionItem.svelte';
  import { APP_NAME } from '$lib/config';
  import { formatMoney, parseTransactionsCSV } from '$lib/util/transaction';
  import { IconNewTab, IconUpKarat, PageContainer } from '@glue/ui';

  export let data;

  let dialogAssignRefund: HTMLDialogElement;
  let refundId: string;

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
      <h2 class="text-3xl font-extrabold">Budget tracking</h2>
    </div>

    <div class="mt-8">
      {#await data.weeklyExpenses}
        <span class="loading loading-spinner loading-sm" />
      {:then weeklyExpenses}
        {#if weeklyExpenses}
          <div
            class="grid grid-cols-6 w-full font-extrabold px-4 border-b-2 border-base-content/20 pb-2 text-sm"
          >
            <p class="col-span-3">Week</p>
            <p class="text-center">Expense</p>
            <p class="text-center">Budget diff</p>
            <p class="text-center">Rollover</p>
          </div>

          {#each weeklyExpenses as { weekString, totalAmount, budgetDiff, budgetRollover } (weekString)}
            <div class="border-b border-base-content/20 py-1">
              <a class="btn btn-ghost w-full" href="#{weekString}">
                <div class="grid grid-cols-6 w-full">
                  <p class="text-sm font-extrabold text-left text-base-content/60 col-span-3">
                    {weekString}
                  </p>
                  <p class="text-sm font-medium">{formatMoney(totalAmount)}</p>
                  <p class="text-sm font-medium text-error" class:text-success={budgetDiff > 0}>
                    {formatMoney(budgetDiff)}
                  </p>
                  <p class="text-sm font-medium text-error" class:text-success={budgetRollover > 0}>
                    {formatMoney(budgetRollover)}
                  </p>
                </div>
              </a>
            </div>
          {/each}
        {/if}
      {/await}
    </div>
  </section>

  <section class="py-12 mt-8">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-extrabold">Pending refund</h2>
    </div>

    {#await data.pendingRefunds}
      <span class="loading loading-spinner loading-sm" />
    {:then pendingRefunds}
      <div class="mt-4">
        {#if pendingRefunds && pendingRefunds.length > 0}
          {#each pendingRefunds as transaction}
            <TransactionItem {transaction} bind:dialogAssignRefund bind:refundId />
          {/each}
        {:else}
          <p class="text-sm text-base-content/80">No transactions pending refund</p>
        {/if}
      </div>
    {/await}
  </section>

  <section class="py-12">
    <div class="flex justify-between items-center">
      <h2 class="text-3xl font-extrabold">Expenses</h2>
    </div>

    <div class="mt-8">
      {#await data.weeklyExpenses}
        <span class="loading loading-spinner loading-sm" />
      {:then weeklyExpenses}
        {#if weeklyExpenses}
          <div class="space-y-8">
            {#each weeklyExpenses
              .slice()
              .reverse() as { weekString, totalAmount, transactions } (weekString)}
              <div class="">
                <div
                  class="flex items-center justify-between pl-4 pr-12 bg-base-300 rounded-xl py-2"
                  id={weekString}
                >
                  <p class="text-sm font-extrabold text-base-content/60">{weekString}</p>
                  <p class="text-sm font-extrabold text-error">{formatMoney(totalAmount)}</p>
                </div>
                <div class="space-y-2 mt-3">
                  {#each transactions as transaction (transaction.id)}
                    <TransactionItem {transaction} bind:dialogAssignRefund bind:refundId />
                  {/each}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      {/await}
    </div>
  </section>

  <div class="fixed right-8 bottom-8">
    <button
      class="btn btn-circle text-3xl"
      on:click={() => {
        if (browser) window.scrollTo(0, 0);
      }}><IconUpKarat /></button
    >
  </div>
</PageContainer>

<dialog bind:this={dialogAssignRefund} class="modal">
  <div class="modal-box relative box-border max-h-[70vh] max-w-lg">
    <h2 class="text-xl font-extrabold">Assign refund</h2>

    <div class="mt-4">
      {#await data.refundCandidates}
        <span class="loading loading-spinner loading-sm" />
      {:then refundCandidates}
        {#if refundCandidates}
          {#each refundCandidates as transaction}
            <TransactionItem {transaction} bind:refundId />
          {/each}
        {/if}
      {/await}
    </div>
  </div>

  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
