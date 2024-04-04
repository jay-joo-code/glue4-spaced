<script lang="ts">
  import { invalidateAll } from '$app/navigation';
  import { APP_NAME } from '$lib/config';
  import { PageContainer } from '@glue/ui';

  export let data;
</script>

<PageContainer {APP_NAME}>
  <div class="space-y-8">
    <!-- create todo -->
    <form class="space-x-2" method="POST" action="?/addTodo">
      <input class="input input-bordered w-full max-w-md" name="text" />
      <button class="btn btn-primary">Add</button>
    </form>

    <!-- refetch todos -->
    <button
      class="btn"
      on:click={() => {
        invalidateAll();
      }}>Refetch</button
    >

    <!-- todos list -->
    {#await data.todos}
      <div class="skeleton w-full h-18" />
      <div class="skeleton w-full h-18" />
      <div class="skeleton w-full h-18" />
    {:then todos}
      <div class="space-y-2">
        {#each todos as todo}
          <div class="p-4 rounded border border-base-content/10">
            <p class="">{todo.text}</p>
          </div>
        {/each}
      </div>
    {/await}
  </div>
</PageContainer>
