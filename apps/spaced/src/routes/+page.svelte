<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { shortcut } from '$lib/actions/shortcut';
  import Flashcard from '$lib/components/Flashcard.svelte';
  import config from '$lib/glue/config';
  import { IconAdd, IconRefresh, PageContainer } from '@glue/ui';
  import { toast } from '@zerodevx/svelte-toast';
  import debounce from 'just-debounce-it';
  import { updateUrlWithSearchParam } from '@glue/utils';

  export let data;

  let isAddCardLoading = false;
  let inputElement: HTMLInputElement;
  let isResetSpaceLoading = false;
  let resetFlashcardTotal = 0;
  let resetFlashcardCurrent = 0;
  let searchTerm = $page.url.searchParams.get('search') || '';

  const addCard = async () => {
    const response = await fetch('/glue/api/crud/flashcard', {
      method: 'POST',
      body: JSON.stringify({
        body: '',
        due: new Date()
      })
    });

    if (response.ok) {
      invalidateAll();
    } else {
      toast.push('There was an error with creating a flashcard');
    }
  };

  const handleInputChange = (query: string) => {
    goto(updateUrlWithSearchParam($page.url, 'search', query), {
      keepFocus: true,
      invalidateAll: true
    });
  };

  const debouncedHandleInputChange = debounce(handleInputChange, 500);

  const resetSpace = async () => {
    toast.push('Feature not implemented');
    // isResetSpaceLoading = true;
    // resetFlashcardTotal = todayFlashcards?.length || 0;
    // resetFlashcardCurrent = 0;
    // try {
    //   const lastFlashcard = todayFlashcards[todayFlashcards?.length - 1];
    //   const daysDiff = differenceInDays(new Date(), new Date(lastFlashcard?.due)) + 1;
    //   for (const flashcard of todayFlashcards) {
    //     const newDue = add(new Date(flashcard?.due), { days: daysDiff });
    //     await supabase.from('flashcards').update({ due: newDue }).eq('id', flashcard?.id).select();
    //     resetFlashcardCurrent += 1;
    //   }
    //   await invalidateAll();
    // } catch (error) {
    //   toast.push('There was an error with resetting spaces');
    // }
    // isResetSpaceLoading = false;
    // resetFlashcardTotal = 0;
    // resetFlashcardCurrent = 0;
  };
</script>

<PageContainer title="Home" layout="mobile-only" APP_NAME={config.appName} class="max-w-3xl ">
  <div class="flex items-center justify-between pl-1">
    <div class="flex items-center">
      <h2 class="text-3xl font-extrabold">Flashcards</h2>
    </div>

    <div class="flex items-center space-x-2">
      <button class="btn-ghost btn-sm btn" on:click={resetSpace} disabled={isResetSpaceLoading}>
        {#if isResetSpaceLoading}
          <span class="loading loading-spinner loading-xs" />
          {resetFlashcardCurrent} / {resetFlashcardTotal}
        {:else}
          <IconRefresh />
        {/if}
        Reset space
      </button>
      <button class="btn-secondary btn-sm btn" on:click={addCard} disabled={isAddCardLoading}>
        {#if isAddCardLoading}
          <span class="loading loading-spinner loading-xs" />
        {:else}
          <IconAdd />
        {/if}
        Add card
      </button>
    </div>
  </div>

  <input
    class="input-bordered input input-md w-full rounded-full mt-8"
    type="text"
    placeholder="Search for a card"
    bind:value={searchTerm}
    bind:this={inputElement}
    on:keyup={(event) => {
      const query = event?.currentTarget?.value?.trim();
      debouncedHandleInputChange(query);
    }}
    use:shortcut={{
      control: true,
      code: 'KeyK',
      callback: () => {
        inputElement.focus();
      }
    }}
  />

  <div class="mt-8">
    {#await data.lazy.flashcards}
      <span class="loading loading-spinner loading-sm" />
    {:then flashcards}
      {#if flashcards.length > 0}
        <p class="text-sm ml-1 text-base-content/80">Showing {flashcards.length} flashcards</p>

        <div class="space-y-4 relative mt-4">
          {#each flashcards as flashcard (flashcard?.id)}
            <Flashcard {flashcard} />
          {/each}

          {#if flashcards.length === 5}
            <div class="absolute bottom-0 w-full bg-gradient-to-t from-base-100 pt-64" />
          {/if}
        </div>
      {:else}
        <p class="text-sm text-center text-base-content/80 mt-10">
          Completed all flashcards for today
        </p>
      {/if}
    {/await}
  </div>
</PageContainer>
