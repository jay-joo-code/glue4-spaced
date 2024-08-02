<script lang="ts">
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { shortcut } from '$lib/actions/shortcut';
  import Flashcard from '$lib/components/Flashcard.svelte';
  import config from '$lib/glue/config';
  import { IconAdd, PageContainer } from '@glue/ui';
  import { updateUrlWithSearchParam } from '@glue/utils';
  import { toast } from '@zerodevx/svelte-toast';
  import debounce from 'just-debounce-it';

  export let data;

  let isAddCardLoading = false;
  let inputElement: HTMLInputElement;
  let searchTerm = $page.url.searchParams.get('search') || '';
  let isCreatingCategory = false;
  let newCategoryName = '';

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

  $: categoryId = $page.url.searchParams.get('category');
</script>

<PageContainer title="Home" layout="mobile-only" APP_NAME={config.appName} class="max-w-3xl ">
  <div class="flex items-center justify-between pl-1">
    <div class="flex items-center">
      <h2 class="text-3xl font-extrabold">Flashcards</h2>
    </div>

    <div class="flex items-center space-x-2">
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

  <div class="mt-4 px-2">
    {#await data.lazy.categories}
      <span class="loading loading-spinner loading-sm" />
    {:then categories}
      <div class="flex gap-x-2 gap-y-3 flex-wrap">
        {#each categories as category}
          <button
            class="btn btn-sm btn-outline border-base-content/30"
            class:btn-active={$page.url.searchParams.get('category') === category.id}
            on:click={() => {
              if ($page.url.searchParams.get('category') === category.id) {
                goto(updateUrlWithSearchParam($page.url, 'category', undefined), {
                  keepFocus: true,
                  invalidateAll: true
                });
              } else {
                goto(updateUrlWithSearchParam($page.url, 'category', category.id), {
                  keepFocus: true,
                  invalidateAll: true
                });
              }
            }}>{category.name} <span class="ml-[1px]">{category.count}</span></button
          >
        {/each}

        {#if isCreatingCategory}
          <form
            on:submit={async () => {
              const response = await fetch('/glue/api/crud/category', {
                method: 'POST',
                body: JSON.stringify({
                  name: newCategoryName
                })
              });

              if (response.ok) {
                invalidateAll();
                newCategoryName = '';
                isCreatingCategory = false;
              } else {
                toast.push('There was an error with creating a new category');
              }
            }}
          >
            <input class="input input-sm !border-base-content" bind:value={newCategoryName} />
          </form>
        {/if}
        <button
          class="btn btn-sm btn-outline text-lg border-base-content/30"
          on:click={() => {
            isCreatingCategory = true;
          }}><IconAdd /></button
        >
      </div>
    {/await}
  </div>

  <div class="mt-12">
    {#await data.lazy.flashcards}
      <span class="loading loading-spinner loading-sm" />
    {:then flashcards}
      {#if flashcards.length > 0}
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

  {#if categoryId}
    <div class="mt-12">
      {#await data.lazy.upcomingFlashcards}
        <span class="loading loading-spinner loading-sm" />
      {:then upcomingFlashcards}
        <h2 class="text-2xl font-extrabold mt-12">Upcoming flashcards</h2>
        <div class="mt-8">
          {#if upcomingFlashcards.length > 0}
            <div class="space-y-4 relative mt-4">
              {#each upcomingFlashcards as flashcard (flashcard?.id)}
                <Flashcard {flashcard} />
              {/each}
            </div>
          {:else}
            <p class="text-sm text-center text-base-content/80 mt-10">No upcoming flashcards</p>
          {/if}
        </div>
      {/await}
    </div>
  {/if}
</PageContainer>
