<script>
  import { APP_NAME } from '$root/src/lib/config';
  import { PageContainer, SignInPage } from '@glue/ui';
</script>

<PageContainer {APP_NAME} title="Login" layout="fullscreen">
  <SignInPage {APP_NAME} bgPattern="autumn" />
</PageContainer>
