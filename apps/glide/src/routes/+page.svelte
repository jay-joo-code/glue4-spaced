<script lang="ts">
  import { APP_NAME } from '$lib/config';
  import { PageContainer } from '@glue/ui';
</script>

<PageContainer {APP_NAME} title="Home">
  <a class="btn" href="/auth/login/google">Sign in</a>
</PageContainer>
