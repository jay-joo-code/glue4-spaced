<script>
  import { PageContainer } from '@glue/ui';
  import { APP_NAME } from '$root/src/lib/config';
</script>

<PageContainer {APP_NAME} title="Signing in ...">
  <div class="flex h-[90vh] w-full items-center justify-center">
    <div class="flex flex-col items-center">
      <span class="loading loading-spinner loading-md" />
      <p class="mt-4 text-xs text-base-content/80">Signing in to {APP_NAME}</p>
    </div>
  </div>
</PageContainer>
