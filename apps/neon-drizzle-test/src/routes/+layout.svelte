<script>
  import { AppLayout } from '@glue/ui';
  import { APP_NAME, PUBLIC_NAVS, PRIVATE_NAVS } from '$lib/config';
  import '$lib/app.css';
</script>

<AppLayout {APP_NAME} {PUBLIC_NAVS} {PRIVATE_NAVS}>
  <slot />
</AppLayout>
