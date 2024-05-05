<script>
  import { APP_NAME } from '$root/src/lib/config';
  import { PageContainer } from '@glue/ui';
</script>

<PageContainer {APP_NAME} title="Login">
  <div class="flex justify-center items-center">
    <a class="btn" href="/auth/login/google">Sign in with Google</a>
  </div>
</PageContainer>
