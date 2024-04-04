<script lang="ts">
  import { page } from '$app/stores';

  $: ({ todos } = $page.data);
  $: console.log('todos', todos);
</script>
