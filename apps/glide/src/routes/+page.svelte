<script lang="ts">
  import { APP_NAME } from '$lib/config';
  import { PageContainer } from '@glue/ui';

  export let data;

  $: console.log('data.user', data.user);
</script>

<PageContainer {APP_NAME} title="Home">
  <a class="btn" href="/auth/login/google">Sign in</a>
</PageContainer>
