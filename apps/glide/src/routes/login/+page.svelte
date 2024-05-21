<script>
  import { APP_NAME } from '$root/src/lib/config';
  import { PageContainer, SignInPage } from '@glue/ui';
  import { page } from '$app/stores';
</script>

<PageContainer {APP_NAME} title="Login">
  <SignInPage
    {APP_NAME}
    bgPattern="autumn"
    redirectTo={$page.url.searchParams.get('redirectTo') ?? '/'}
  />
</PageContainer>
