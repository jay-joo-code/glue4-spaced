<script>
  import { page } from '$app/stores';
  import { APP_NAME } from '$root/src/lib/config';
  import { SignInPage } from '@glue/ui';
</script>

<SignInPage
  {APP_NAME}
  bgPattern="autumn"
  redirectTo={$page.url.searchParams.get('redirectTo') ?? '/'}
/>
