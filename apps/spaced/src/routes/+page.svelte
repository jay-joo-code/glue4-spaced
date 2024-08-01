<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { shortcut } from '$lib/actions/shortcut';
  import Flashcard from '$lib/components/Flashcard.svelte';
  import config from '$lib/glue/config';
  import { IconAdd, IconRefresh, PageContainer } from '@glue/ui';
  import { toast } from '@zerodevx/svelte-toast';

  export let data;

  let searchQuery = '';
  let searchResultCards = [];
  let isAddCardLoading = false;
  let inputElement;
  let isResetSpaceLoading = false;
  let resetFlashcardTotal = 0;
  let resetFlashcardCurrent = 0;

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

  const fetchSearchResults = async (query: string) => {
    // const searchQuery = `'${query?.split(' ')?.join("' & '")}'`;
    // const { data, error } = await supabase
    //   .from('flashcards')
    //   .select()
    //   .textSearch('body', searchQuery);
    // if (error) toast.push('There was an error with search for flashcards');
    // else {
    //   searchResultCards = data;
    // }
  };

  const resetSearchResults = () => {
    if (searchResultCards?.length > 0) {
      searchResultCards = [];
    }
  };

  const handleDebouncedInputChange = (query: string) => {
    // clearTimeout(timer);
    // timer = setTimeout(() => {
    //   searchQuery = query;
    //   fetchSearchResults(query);
    // }, 500);
  };

  const resetSpace = async () => {
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
    bind:this={inputElement}
    on:keyup={(event) => {
      const query = event?.target?.value?.trim();
      if (query) handleDebouncedInputChange(query);
      else {
        resetSearchResults();
        searchQuery = '';
      }
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
    {#await data.todayFlashcards}
      <span class="loading loading-spinner loading-sm" />
    {:then todayFlashcards}
      {#if todayFlashcards.length > 0}
        <div class="space-y-4 relative">
          {#each todayFlashcards as flashcard (flashcard?.id)}
            <Flashcard {flashcard} />
          {/each}
          <div class="absolute bottom-0 w-full bg-gradient-to-t from-base-100 pt-64" />
        </div>
      {:else}
        <p class="text-sm text-center text-base-content/80 mt-10">
          Completed all flashcards for today
        </p>
      {/if}
    {/await}
  </div>
</PageContainer>
