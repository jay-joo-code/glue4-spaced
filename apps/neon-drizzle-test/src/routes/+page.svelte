<script lang="ts">
  import { dev } from '$app/environment';
  import { goto, invalidateAll } from '$app/navigation';
  import { page } from '$app/stores';
  import { APP_NAME } from '$lib/config';
  import { IconDelete, IconSearch, PageContainer } from '@glue/ui';
  import SuperDebug, { superForm } from 'sveltekit-superforms';
  import debounce from 'just-debounce-it';

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

  const handleUpdate = async (id: string, text: string) => {
    await fetch('/api/todos', {
      method: 'PUT',
      body: JSON.stringify({ id, text }),
      headers: {
        'content-type': 'application/json'
      }
    });
  };

  const debouncedHandleUpdate = debounce(handleUpdate, 500);
</script>

<PageContainer {APP_NAME}>
  <div class="space-y-8 max-w-lg w-full">
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
    <div class="space-y-2">
      {#await data.todos}
        <div class="skeleton w-full h-12" />
        <div class="skeleton w-full h-12" />
        <div class="skeleton w-full h-12" />
      {:then todos}
        {#each todos as todo (todo.id)}
          <div
            class="rounded-xl border border-base-content/10 flex items-center justify-between space-x-4 pr-4"
          >
            <input
              class="input rounded-xl w-full"
              bind:value={todo.text}
              on:input={(event) => {
                if (event.currentTarget.value)
                  debouncedHandleUpdate(todo.id, event.currentTarget.value);
              }}
            />
            <button
              class="btn text-xl btn-sm text-base-content/80"
              on:click={() => handleDelete(todo.id)}
            >
              <IconDelete />
            </button>
          </div>
        {/each}
      {/await}
    </div>
  </div>
</PageContainer>
