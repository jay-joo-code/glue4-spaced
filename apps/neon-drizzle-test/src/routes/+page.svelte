<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

{#await data.todos}
  <div class="skeleton w-32 h-32" />
{:then todos}
  {#each todos as todo}
    <div class="p-4 rounded border border-base-content/10">
      <p class="">{todo.text}</p>
    </div>
  {/each}
{/await}
