<script lang="ts">
  import { dev } from '$app/environment';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { APP_NAME } from '$lib/config';
  import { IconDelete, IconSearch, PageContainer } from '@glue/ui';
  import SuperDebug, { superForm } from 'sveltekit-superforms';

  export let data;

  const { form } = superForm(data.addTodoForm);
  let searchQuery = $page.url.searchParams.get('q') || '';

  const handleSearch = () => {
    const path = searchQuery ? `/?q=${encodeURIComponent(searchQuery)}` : '/';
    goto(path, { keepFocus: true });
  };

  const handleDelete = async (todoId: string) => {
    const response = await fetch('/api/todos', {
      method: 'DELETE',
      body: JSON.stringify({ todoId }),
      headers: {
        'content-type': 'application/json'
      }
    });

    await response.json();
    await invalidateAll();
  };
</script>

<PageContainer {APP_NAME}>
  <div class="space-y-8 max-w-lg">
    <!-- create todo -->
    {#if dev}
      <SuperDebug data={$form} />
    {/if}
    <form class="space-x-2" method="POST" action="?/addTodo">
      <input
        class="input input-bordered w-full max-w-md"
        name="text"
        placeholder="Add task"
        bind:value={$form.text}
      />
    </form>

    <!-- search todos -->
    <form class="space-x-4" on:submit|preventDefault={handleSearch}>
      <label class="input rounded-full input-bordered flex items-center gap-2">
        <input type="text" class="grow" name="q" placeholder="Search" bind:value={searchQuery} />
        <IconSearch />
      </label>
    </form>

    <!-- todos list -->
    {#await data.todos}
      <div class="skeleton w-full h-18" />
      <div class="skeleton w-full h-18" />
      <div class="skeleton w-full h-18" />
    {:then todos}
      <div class="space-y-2">
        {#each todos as todo (todo.id)}
          <div class="p-4 rounded border border-base-content/10 flex items-center justify-between">
            <p class="">{todo.text}</p>
            <button
              class="btn text-xl btn-sm text-base-content/80"
              on:click={() => handleDelete(todo.id)}
            >
              <IconDelete />
            </button>
          </div>
        {/each}
      </div>
    {/await}
  </div>
</PageContainer>
