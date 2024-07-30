<script>
  import { page } from '$app/stores';
  import config from '$lib/glue/config';
  import { SignInPage } from '@glue/ui';
</script>

<SignInPage
  APP_NAME={config.appName}
  bgPattern="autumn"
  redirectTo={$page.url.searchParams.get('redirectTo') ?? '/'}
/>
